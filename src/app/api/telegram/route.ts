import { handleUpdate, webhookSecret } from "@/lib/telegram";

export async function POST(request: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN || request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret()) {
    return new Response(null, { status: 401 });
  }
  try {
    await handleUpdate(await request.json());
  } catch (error) {
    console.error("[telegram] update", error);
  }
  return Response.json({ ok: true });
}
