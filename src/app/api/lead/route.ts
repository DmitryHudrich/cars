// Приём заявок со всех форм сайта.
// TODO: сохранять в БД (админка) и отправлять уведомление в Telegram менеджерам.

type LeadPayload = {
  source?: string;
  name?: string;
  phone?: string;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  let data: LeadPayload;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const digits = String(data.phone ?? "").replace(/\D/g, "");
  if (digits.length !== 11) {
    return Response.json({ ok: false, error: "phone" }, { status: 422 });
  }

  console.log("[lead]", new Date().toISOString(), JSON.stringify(data));
  return Response.json({ ok: true });
}
