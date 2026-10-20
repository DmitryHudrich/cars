import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import { news, type Article } from "@/data/news";
import styles from "./ArticlePage.module.css";

function inline(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function render(text: string) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  let steps: string[] = [];
  let table: string[][] = [];
  const flush = () => {
    if (list.length) {
      out.push(<ul key={`l${out.length}`}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
      list = [];
    }
    if (steps.length) {
      out.push(<ol key={`o${out.length}`}>{steps.map((l, i) => <li key={i}>{inline(l)}</li>)}</ol>);
      steps = [];
    }
    if (table.length) {
      const [head, ...rows] = table;
      out.push(
        <div key={`t${out.length}`} className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>{head.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      table = [];
    }
  };
  for (const raw of text.trim().split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("— ")) { if (steps.length || table.length) flush(); list.push(line.slice(2)); continue; }
    if (/^\d+\. /.test(line)) { if (list.length || table.length) flush(); steps.push(line.replace(/^\d+\. /, "")); continue; }
    if (line.startsWith(":: ")) { if (list.length || steps.length) flush(); table.push(line.slice(3).split(" | ")); continue; }
    flush();
    if (line.startsWith("## ")) out.push(<h2 key={out.length}>{line.slice(3)}</h2>);
    else if (line.startsWith("### ")) out.push(<h3 key={out.length}>{line.slice(4)}</h3>);
    else if (line.startsWith("! ")) out.push(<p key={out.length} className={styles.note}>{inline(line.slice(2))}</p>);
    else out.push(<p key={out.length}>{inline(line)}</p>);
  }
  flush();
  return out;
}

export function ArticlePage({ article }: { article: Article }) {
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
        {render(article.body)}

        <div className={styles.cta}>
          <p>Нужен расчёт стоимости автомобиля под ключ?</p>
          <Link href="/#contacts" className={styles.ctaBtn}>
            Получить расчёт <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <section className={`container ${styles.more}`}>
        <h2 className={styles.moreTitle}>Читайте также</h2>
        <div className={styles.moreGrid}>
          {more.map((n) => (
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
