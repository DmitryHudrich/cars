import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/news/ArticlePage";
import { getContent } from "@/lib/cms";

export async function generateStaticParams() {
  const { news } = await getContent();
  return news.map((n) => ({ slug: n.slug }));
}

async function getArticle(slug: string) {
  const { news } = await getContent();
  return { article: news.find((n) => n.slug === slug), news };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { article } = await getArticle((await params).slug);
  if (!article) return {};
  return { title: `${article.title} — Ранг Авто`, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { article, news } = await getArticle((await params).slug);
  if (!article) notFound();
  return <ArticlePage article={article} news={news} />;
}
