import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Article } from "@/data/news";
import { Markdown } from "@/components/ui/Markdown";
import styles from "./ArticlePage.module.css";

export function ArticlePage({ article, news }: { article: Article; news: Article[] }) {
  const more = news.filter((n) => n.slug !== article.slug);
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <Link href="/#news" className={styles.back}>
            <ArrowLeft size={18} /> Все статьи
          </Link>
          <Link href="/">
            <img src={asset("/icons/logo-light.svg")} alt="Ранг Авто" width={180} height={40} />
          </Link>
        </div>
      </header>

      <main className={`container ${styles.doc}`}>
        <div className={styles.meta}>
          <span className={styles.tag}>{article.tag}</span>
          <span>Дата актуализации: {article.date}</span>
        </div>
        <h1 className="h2">{article.title}</h1>
        <div className={styles.cover}>
          <img src={article.img} alt="" />
        </div>
        <Markdown text={article.body} classes={{ note: styles.note, tableWrap: styles.tableWrap, table: styles.table }} />

        <div className={styles.cta}>
          <p>Нужен расчёт стоимости автомобиля под ключ?</p>
          <Link href="/#lead" className={styles.ctaBtn}>
            Получить расчёт <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <section className={`container ${styles.more}`}>
        <h2 className={styles.moreTitle}>Читайте также</h2>
        <div className={styles.moreGrid}>
          {more.slice(0, 3).map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} className={styles.moreCard}>
              <img src={n.img} alt="" loading="lazy" />
              <span className={styles.moreTag}>{n.tag}</span>
              <span className={styles.moreName}>{n.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
