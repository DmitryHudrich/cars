import type { Metadata } from "next";

export const SITE_URL = "https://rangauto.ru";
export const SITE_NAME = "Ранг Авто";

const SUFFIX = ` — ${SITE_NAME}`;
const MAX_TITLE = 65;

export function pageTitle(title: string) {
  if (title.length + SUFFIX.length <= MAX_TITLE) return title + SUFFIX;
  const short = title.split(/[:?]/)[0].trim();
  return short.length + SUFFIX.length <= MAX_TITLE ? short + SUFFIX : short;
}

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

export function pageMeta({ title, description, path, image = "/og.jpg", type = "website" }: PageMeta): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "ru_RU",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [{ url: new URL(image, SITE_URL).toString() }],
    },
  };
}
