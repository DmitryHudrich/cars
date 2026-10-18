"use client";

import { useEffect, useState } from "react";
import { countries } from "@/data/content";
import styles from "./Hero.module.css";

// Чипсы стран + заголовок, в котором слово страны меняется (автоматически, пока пользователь не кликнет).
export function HeroCountry() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % countries.length), 3200);
    return () => clearInterval(t);
  }, [auto]);

  const current = countries[idx];

  return (
    <>
      <div className={styles.chips} role="tablist" aria-label="Страна импорта">
        {countries.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={i === idx}
            className={styles.chip}
            onClick={() => {
              setIdx(i);
              setAuto(false);
            }}
          >
            <img src={c.flag} alt="" width={40} height={24} />
            {c.name}
          </button>
        ))}
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
