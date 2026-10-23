"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { countries } from "@/data/content";
import { japanCatalogLinks } from "@/data/site";
import styles from "./Hero.module.css";

// Чипсы стран + заголовок, в котором слово страны меняется (автоматически, пока пользователь не кликнет).
export function HeroCountry() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % countries.length), 3200);
    return () => clearInterval(t);
  }, [auto]);

  const current = countries[idx];

  return (
    <>
      <div className={styles.chips} role="tablist" aria-label="Страна импорта">
        {countries.map((c, i) => {
          const chip = (
            <button
              key={c.id}
              role="tab"
              aria-selected={i === idx}
              aria-haspopup={c.id === "jp" ? "menu" : undefined}
              aria-expanded={c.id === "jp" ? menuOpen : undefined}
              className={styles.chip}
              onClick={() => {
                setIdx(i);
                setAuto(false);
                if (c.id === "jp") setMenuOpen((o) => !o);
              }}
            >
              <img src={c.flag} alt="" width={40} height={24} />
              {c.name}
              {c.id === "jp" && <ChevronDown size={18} className={styles.chipChev} />}
            </button>
          );
          if (c.id !== "jp") return chip;
          return (
            <div key={c.id} ref={menuRef} className={styles.chipWrap} data-open={menuOpen || undefined}>
              {chip}
              <div className={styles.chipMenu} role="menu">
                {japanCatalogLinks.map((l) => (
                  <a key={l.href} href={l.href} role="menuitem">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h1 className={styles.title}>
        Авто из{" "}
        <span className={styles.word} key={current.id}>
          {current.genitive}
        </span>
        <br />
        под ключ от 25 дней
      </h1>
    </>
  );
}
