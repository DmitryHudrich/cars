"use client";

import { useState } from "react";
import { Marquee } from "@/components/ui/Marquee";
import { Lightbox } from "@/components/ui/Lightbox";
import { clientPhotos } from "@/data/content";
import styles from "./Hero.module.css";

// Лента фото клиентов под первым экраном: плавно едет, на наведении замирает, по клику — просмотр.
export function ClientsStrip() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.strip}>
      <Marquee duration={45} gap={20}>
        {clientPhotos.map((p, i) => (
          <button key={i} className={styles.stripItem} onClick={() => setOpen(i)} aria-label="Открыть фото">
            <img src={p.src} alt={p.alt} width={274} height={206} loading="lazy" />
          </button>
        ))}
      </Marquee>
      {open !== null && <Lightbox items={clientPhotos} start={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
