import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyText } from "@/data/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Политика конфиденциальности — Ранг Авто",
  description:
    "Политика ООО «Ранг Авто» в отношении обработки персональных данных: какие данные собираем через сайт rangauto.ru, зачем, как храним и защищаем.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage title="Политика в отношении обработки персональных данных" text={privacyText} />;
}
