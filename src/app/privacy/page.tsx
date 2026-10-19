import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyText } from "@/data/legal";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Ранг Авто",
  description: "Политика в отношении обработки персональных данных.",
};

export default function PrivacyPage() {
  return <LegalPage title="Политика в отношении обработки персональных данных" text={privacyText} />;
}
