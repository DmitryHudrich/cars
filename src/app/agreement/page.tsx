import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { agreementText } from "@/data/legal";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Ранг Авто",
  description: "Об использовании сайта rangauto.ru.",
};

export default function AgreementPage() {
  return (
    <LegalPage
      title="Пользовательское соглашение"
      subtitle="Об использовании сайта rangauto.ru · ООО «РАНГ АВТО»"
      text={agreementText}
    />
  );
}
