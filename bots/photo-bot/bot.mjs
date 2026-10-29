import fs from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.PHOTO_BOT_TOKEN ?? "";
const API = process.env.TELEGRAM_API_URL ?? "https://api.telegram.org";
const DATA = path.resolve(process.env.PHOTO_BOT_DATA ?? "./photo-bot-data");
const ALLOWED = new Set(
  (process.env.PHOTO_BOT_ALLOWED_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number),
);

if (!TOKEN) {
  console.error("PHOTO_BOT_TOKEN не задан");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(method, body = {}, timeout = 70000) {
  const res = await fetch(`${API}/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
  const json = await res.json().catch(() => ({}));
  if (!json.ok) throw new Error(`${method}: ${res.status} ${JSON.stringify(json)}`);
  return json.result;
}

const say = (chat_id, text) => call("sendMessage", { chat_id, text, parse_mode: "HTML" }).catch((e) => console.error(e));

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(`${file}.tmp`, JSON.stringify(value, null, 2));
  await fs.rename(`${file}.tmp`, file);
}

const ownerFile = path.join(DATA, "owner.json");

async function isAllowed(userId) {
  if (ALLOWED.size) return ALLOWED.has(userId);
  const owner = await readJson(ownerFile, null);
  if (owner) return owner.id === userId;
  await writeJson(ownerFile, { id: userId, since: new Date().toISOString() });
  console.log(`[photo-bot] владелец: ${userId}`);
  return true;
}

const sessionDir = (chatId) => path.join(DATA, "sessions", String(chatId));
const sessionFile = (chatId) => path.join(sessionDir(chatId), "session.json");
const emptySession = () => ({ items: [], lastCaption: "", groups: {} });

const loadSession = async (chatId) => ({ ...emptySession(), ...(await readJson(sessionFile(chatId), {})) });
const saveSession = (chatId, s) => writeJson(sessionFile(chatId), s);

const queues = new Map();
function serial(key, fn) {
  const prev = queues.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  queues.set(key, next.catch(() => {}));
  return next;
}

function pickFile(msg) {
  if (msg.photo?.length) {
    const p = msg.photo[msg.photo.length - 1];
    return { file_id: p.file_id, ext: ".jpg", width: p.width, height: p.height };
  }
  const d = msg.document;
  if (d && (d.mime_type ?? "").startsWith("image/")) {
    const ext = path.extname(d.file_name ?? "") || `.${d.mime_type.split("/")[1]}`;
    return { file_id: d.file_id, ext: ext.toLowerCase(), original: d.file_name };
  }
  return null;
}

async function download(fileId, dest) {
  const file = await call("getFile", { file_id: fileId }, 20000);
  const res = await fetch(`${API}/file/bot${TOKEN}/${file.file_path}`, { signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`download ${res.status}`);
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "bez-podpisi";

async function addPhoto(msg, file) {
  const chatId = msg.chat.id;
  const s = await loadSession(chatId);
  let caption = (msg.caption ?? "").trim();
  if (msg.media_group_id) {
    if (caption) s.groups[msg.media_group_id] = caption;
    else caption = s.groups[msg.media_group_id] ?? "";
    if (caption) for (const it of s.items) if (it.mediaGroup === msg.media_group_id && !it.caption) it.caption = caption;
  }
  if (!caption && !msg.media_group_id) caption = s.lastCaption;
  if (caption) s.lastCaption = caption;

  const n = s.items.length + 1;
  const name = `${String(n).padStart(2, "0")}${file.ext}`;
  await fs.mkdir(path.join(sessionDir(chatId), "files"), { recursive: true });
  await download(file.file_id, path.join(sessionDir(chatId), "files", name));

  s.items.push({
    n,
    name,
    caption,
    captionSource: msg.caption ? "own" : caption ? "inherited" : "none",
    mediaGroup: msg.media_group_id ?? null,
    from: msg.forward_origin?.sender_user?.first_name ?? msg.forward_origin?.sender_user_name ?? msg.forward_from?.first_name ?? null,
    date: new Date((msg.forward_origin?.date ?? msg.forward_date ?? msg.date) * 1000).toISOString(),
    width: file.width ?? null,
    height: file.height ?? null,
    original: file.original ?? null,
  });
  await saveSession(chatId, s);
  return s;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

function instructions(groups) {
  const lines = [
    "# Фотографии для статей",
    "",
    "Фотографии в этом архиве подписаны автором: подпись говорит, к какой статье относится фото и, возможно, куда его поставить.",
    "Замени фотографии в соответствующих статьях. Опирайся только на подписи. Если по подписи статью или место однозначно определить нельзя — не угадывай, перечисли такие фото и спроси.",
    "",
    "Те же данные в JSON — `manifest.json`.",
    "",
  ];
  for (const g of groups) {
    lines.push(`## ${g.caption || "Без подписи"}`, "");
    for (const it of g.items) lines.push(`- \`${it.path}\`${it.captionSource === "inherited" ? " (подпись взята из альбома или предыдущего сообщения)" : ""}`);
    lines.push("");
  }
  return lines.join("\n");
}

async function buildArchive(chatId) {
  const s = await loadSession(chatId);
  if (!s.items.length) return null;
  const byCaption = new Map();
  for (const it of s.items) {
    const key = it.caption || "";
    if (!byCaption.has(key)) byCaption.set(key, []);
    byCaption.get(key).push(it);
  }
  const groups = [];
  const entries = [];
  let i = 0;
  for (const [caption, items] of byCaption) {
    i++;
    const folder = `photos/${String(i).padStart(2, "0")}-${slugify(caption)}`;
    const groupItems = [];
    for (const it of items) {
      const p = `${folder}/${it.name}`;
      entries.push({ name: p, data: await fs.readFile(path.join(sessionDir(chatId), "files", it.name)) });
      groupItems.push({ path: p, captionSource: it.captionSource, width: it.width, height: it.height, original: it.original, from: it.from, date: it.date });
    }
    groups.push({ caption, items: groupItems });
  }
  const manifest = { createdAt: new Date().toISOString(), groups };
  entries.unshift(
    { name: "CLAUDE.md", data: Buffer.from(instructions(groups), "utf8") },
    { name: "manifest.json", data: Buffer.from(JSON.stringify(manifest, null, 2), "utf8") },
  );
  return { buffer: zip(entries), count: s.items.length, groups };
}

async function sendArchive(chatId) {
  const built = await buildArchive(chatId);
  if (!built) return say(chatId, "Пока нет ни одной фотографии. Перешлите сообщения с фото и подписями.");
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", `Фото: ${built.count}, статей: ${built.groups.length}. Закиньте архив в Cowork — внутри CLAUDE.md с разметкой.`);
  form.append("document", new Blob([built.buffer], { type: "application/zip" }), `photos-${stamp}.zip`);
  const res = await fetch(`${API}/bot${TOKEN}/sendDocument`, { method: "POST", body: form, signal: AbortSignal.timeout(300000) });
  const json = await res.json().catch(() => ({}));
  if (!json.ok) throw new Error(`sendDocument: ${res.status} ${JSON.stringify(json)}`);
  await fs.rm(sessionDir(chatId), { recursive: true, force: true });
}

async function summary(chatId) {
  const s = await loadSession(chatId);
  if (!s.items.length) return "Пока пусто.";
  const counts = new Map();
  for (const it of s.items) counts.set(it.caption || "Без подписи", (counts.get(it.caption || "Без подписи") ?? 0) + 1);
  return [`Собрано фото: ${s.items.length}`, ...[...counts].map(([c, n]) => `• ${esc(c.slice(0, 80))} — ${n}`)].join("\n");
}

const HELP = [
  "Перешлите сюда сообщения с фотографиями и подписями — я соберу их в архив для Cowork.",
  "",
  "• Фото без подписи получает подпись из своего альбома или из предыдущего сообщения.",
  "• Можно переслать текст отдельно — он станет подписью для следующих фото.",
  "",
  "/done — получить архив",
  "/list — что уже собрано",
  "/reset — начать заново",
].join("\n");

const statusTimers = new Map();
function notifyLater(chatId) {
  clearTimeout(statusTimers.get(chatId));
  statusTimers.set(
    chatId,
    setTimeout(async () => say(chatId, `${await summary(chatId)}\n\nКогда всё перешлёте — /done`), 2500),
  );
}

async function handle(msg) {
  const chatId = msg.chat.id;
  if (msg.chat.type !== "private" || !msg.from) return;
  if (!(await isAllowed(msg.from.id))) return say(chatId, `Это закрытый бот. Ваш ID: <code>${msg.from.id}</code>`);

  const text = (msg.text ?? "").trim();
  const cmd = text.startsWith("/") ? text.split(/[\s@]/)[0].toLowerCase() : "";

  if (cmd === "/start" || cmd === "/help") return say(chatId, HELP);
  if (cmd === "/list") return say(chatId, await summary(chatId));
  if (cmd === "/reset") {
    await fs.rm(sessionDir(chatId), { recursive: true, force: true });
    return say(chatId, "Очищено.");
  }
  if (cmd === "/done" || /^готово$/i.test(text)) {
    clearTimeout(statusTimers.get(chatId));
    await say(chatId, "Собираю архив…");
    return sendArchive(chatId).catch((e) => {
      console.error(e);
      return say(chatId, `Не получилось отправить архив: ${esc(e.message)}`);
    });
  }

  const file = pickFile(msg);
  if (file) {
    await addPhoto(msg, file);
    return notifyLater(chatId);
  }
  if (text && !cmd) {
    const s = await loadSession(chatId);
    s.lastCaption = text;
    await saveSession(chatId, s);
    return say(chatId, `Подпись для следующих фото: «${esc(text.slice(0, 100))}»`);
  }
}

async function main() {
  await fs.mkdir(DATA, { recursive: true });
  const me = await call("getMe", {}, 15000);
  const hook = await call("getWebhookInfo", {}, 15000);
  if (hook.url) {
    console.error(`[photo-bot] у бота стоит webhook ${hook.url} — этот токен уже используется другим ботом, long polling невозможен`);
    process.exit(1);
  }
  await call("setMyCommands", {
    commands: [
      { command: "done", description: "Получить архив" },
      { command: "list", description: "Что уже собрано" },
      { command: "reset", description: "Начать заново" },
    ],
  }).catch(() => {});
  console.log(`[photo-bot] @${me.username} запущен, данные в ${DATA}`);

  const offsetFile = path.join(DATA, "offset.json");
  let offset = (await readJson(offsetFile, { offset: 0 })).offset;
  for (;;) {
    try {
      const updates = await call("getUpdates", { offset, timeout: 50, allowed_updates: ["message"] });
      for (const u of updates) {
        offset = u.update_id + 1;
        if (u.message) serial(u.message.chat.id, () => handle(u.message)).catch((e) => console.error("[photo-bot]", e));
      }
      if (updates.length) await writeJson(offsetFile, { offset });
    } catch (e) {
      console.error("[photo-bot]", e.message);
      await sleep(5000);
    }
  }
}

main();
