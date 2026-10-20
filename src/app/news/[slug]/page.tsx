import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/news/ArticlePage";
import { getArticle, news } from "@/data/news";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return { title: `${article.title} — Ранг Авто`, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
