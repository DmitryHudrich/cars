import type { ReactNode } from "react";

type Classes = { note?: string; tableWrap?: string; table?: string };

function inline(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

const cells = (line: string) =>
  line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

export function Markdown({ text, classes = {} }: { text: string; classes?: Classes }) {
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let table: string[][] = [];

  const flush = () => {
    if (list) {
      const items = list.items.map((l, i) => <li key={i}>{inline(l)}</li>);
      out.push(list.ordered ? <ol key={out.length}>{items}</ol> : <ul key={out.length}>{items}</ul>);
      list = null;
    }
    if (table.length) {
      const [head, ...rows] = table;
      out.push(
        <div key={out.length} className={classes.tableWrap}>
          <table className={classes.table}>
            <thead>
              <tr>{head.map((c, i) => <th key={i}>{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, i) => <td key={i}>{inline(c)}</td>)}</tr>
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
    const bullet = /^[-*] /.test(line);
    const step = /^\d+\. /.test(line);
    if (bullet || step) {
      if (table.length || (list && list.ordered !== step)) flush();
      list ??= { ordered: step, items: [] };
      list.items.push(line.replace(/^([-*]|\d+\.) /, ""));
      continue;
    }
    if (line.startsWith("|")) {
      if (list) flush();
      if (!/^\|[\s:|-]+\|$/.test(line)) table.push(cells(line));
      continue;
    }
    flush();
    if (line.startsWith("### ")) out.push(<h3 key={out.length}>{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## ")) out.push(<h2 key={out.length}>{inline(line.slice(3))}</h2>);
    else if (line.startsWith("> ")) out.push(<p key={out.length} className={classes.note}>{inline(line.slice(2))}</p>);
    else out.push(<p key={out.length}>{inline(line)}</p>);
  }
  flush();
  return out;
}
