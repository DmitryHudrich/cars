"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { countries } from "@/data/content";
import { catalogUrls, japanCatalogLinks } from "@/data/site";
import styles from "./Hero.module.css";

export function HeroCountry() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const touch = useRef(false);

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
      <nav className={styles.chips} aria-label="Каталог по странам">
        {countries.map((c, i) => {
          const isJp = c.id === "jp";
          const chip = (
            <a
              key={c.id}
              href={catalogUrls[c.id]}
              data-active={i === idx || undefined}
              aria-haspopup={isJp ? "menu" : undefined}
              aria-expanded={isJp ? menuOpen : undefined}
              className={styles.chip}
              onMouseEnter={() => {
                setIdx(i);
                setAuto(false);
              }}
              onPointerDown={(e) => {
                touch.current = e.pointerType !== "mouse";
              }}
              onClick={(e) => {
                setIdx(i);
                setAuto(false);
                if (isJp && touch.current && !menuOpen) {
                  e.preventDefault();
                  setMenuOpen(true);
                }
              }}
            >
              <img src={c.flag} alt="" width={40} height={24} />
              {c.name}
              {isJp && <ChevronDown size={18} className={styles.chipChev} />}
            </a>
          );
          if (!isJp) return chip;
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
      </nav>

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
