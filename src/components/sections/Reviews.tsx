"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/ui/Lightbox";
import { reviews } from "@/data/content";
import styles from "./Reviews.module.css";

// Анимация (вариант на согласование): фото «раскладываются» каскадом при появлении блока,
// на наведении — приближение и подпись, по клику — полноэкранный просмотр с листанием.
export function Reviews() {
  const gridRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = reviews.map((r) => ({ src: r.photo, alt: `${r.name}, ${r.car}`, caption: r.car }));

  return (
    <section className="section section--dark" id="reviews">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">[ Отзывы клиентов ]</p>
            <h2 className="h2">Реальные отзывы</h2>
          </div>
        </div>

        <ul className={styles.grid} ref={gridRef} data-visible={visible || undefined}>
          {reviews.map((r, i) => (
            <li key={i} style={{ "--i": i } as CSSProperties}>
              <button className={styles.item} onClick={() => setOpen(i)} aria-label={`Открыть фото: ${r.car}`}>
                <img src={r.photo} alt={`${r.name}, ${r.car}`} loading="lazy" />
                <span className={styles.overlay}>
                  <span>{r.car}</span>
                  <Expand size={18} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open !== null && <Lightbox items={items} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
