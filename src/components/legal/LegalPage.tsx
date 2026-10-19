import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { asset } from "@/lib/asset";
import styles from "./LegalPage.module.css";

// Почта и ссылки в тексте делаем кликабельными
function linkify(text: string): ReactNode[] {
  return text.split(/(rangauto@mail\.ru|https:\/\/rangauto\.ru[^\s,]*?)(?=[\s,]|\.?$)/).map((part, i) => {
    if (part === "rangauto@mail.ru") return <a key={i} href="mailto:rangauto@mail.ru">{part}</a>;
    if (part.startsWith("https://rangauto.ru")) return <a key={i} href={part}>{part}</a>;
    return part;
  });
}

function render(text: string) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  let table: [string, string][] = [];
  const flush = () => {
    if (list.length) {
      out.push(<ul key={`l${out.length}`}>{list.map((l, i) => <li key={i}>{linkify(l)}</li>)}</ul>);
      list = [];
    }
    if (table.length) {
      out.push(
        <dl key={`t${out.length}`} className={styles.table}>
          {table.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>,
      );
      table = [];
    }
  };
  for (const raw of text.trim().split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("— ")) { list.push(line.slice(2)); continue; }
    if (line.startsWith(":: ")) { const [k, v] = line.slice(3).split(" | "); table.push([k, v]); continue; }
    flush();
    if (/^\d+\. /.test(line)) out.push(<h2 key={out.length}>{line}</h2>);
    else out.push(<p key={out.length}>{linkify(line)}</p>);
  }
  flush();
  return out;
}

export function LegalPage({ title, subtitle, text }: { title: string; subtitle?: string; text: string }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <Link href="/" className={styles.back}>
            <ArrowLeft size={18} /> На главную
          </Link>
          <img src={asset("/icons/logo-light.svg")} alt="Ранг Авто" width={180} height={40} />
        </div>
      </header>

      <main className={`container ${styles.doc}`}>
        <h1 className="h2">{title}</h1>
        {subtitle && <p className={styles.meta}>{subtitle}</p>}
        {render(text)}
      </main>
    </div>
  );
}
