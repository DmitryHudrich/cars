"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./Lightbox.module.css";

export type LightboxItem = { src: string; alt: string; caption?: string };

export function Lightbox({
  items,
  start,
  onClose,
}: {
  items: LightboxItem[];
  start: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(start);
  const touchX = useRef<number | null>(null);

  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  useEffect(() => {
    ref.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const item = items[i];

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <button className={styles.close} onClick={() => ref.current?.close()} aria-label="Закрыть">
        <X size={28} />
      </button>
      <figure
        className={styles.figure}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <img key={item.src + i} src={item.src} alt={item.alt} className={styles.img} />
        <figcaption className={styles.caption}>
          {item.caption && <span>{item.caption}</span>}
          <span className={styles.counter}>
            {i + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
      {items.length > 1 && (
        <>
          <button className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Предыдущее фото">
            <ChevronLeft size={28} />
          </button>
          <button className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Следующее фото">
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </dialog>
  );
}
