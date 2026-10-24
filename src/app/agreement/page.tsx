import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { agreementText } from "@/data/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Пользовательское соглашение — Ранг Авто",
  description:
    "Пользовательское соглашение сайта rangauto.ru: правила использования сайта, отправки заявок на подбор и расчёт автомобиля, ответственность сторон.",
  path: "/agreement",
});

export default function AgreementPage() {
  return (
    <LegalPage
      title="Пользовательское соглашение"
      subtitle="Об использовании сайта rangauto.ru · ООО «РАНГ АВТО»"
      text={agreementText}
    />
  );
}
