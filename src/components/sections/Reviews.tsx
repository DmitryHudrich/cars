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
  const [open, setOpen] = useState<number | null>(null);
  // сначала два ряда, остальное — по кнопке
  const [expanded, setExpanded] = useState(false);
  const STEP = 8;

  useEffect(() => {
    const el = gridRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    // Прячем фото только если блок ещё ниже экрана: без JS или при сбое наблюдателя
    // отзывы остаются видимыми, анимация — лишь надстройка.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          delete el.dataset.armed;
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
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
            <span className="eyebrow" aria-hidden />
            <h2 className="h2">Наши довольные клиенты</h2>
          </div>
        </div>

        <ul className={styles.grid} ref={gridRef}>
          {(expanded ? reviews : reviews.slice(0, STEP)).map((r, i) => (
            <li key={r.photo} style={{ "--i": i % STEP } as CSSProperties} className={i >= STEP ? styles.more : undefined}>
              <button className={styles.item} onClick={() => setOpen(i)} aria-label={`Открыть фото: ${r.car}`}>
                <img src={r.photo} alt={`${r.name}, ${r.car}`} loading="lazy" style={{ objectPosition: r.pos }} />
                <span className={styles.overlay}>
                  <span>{r.car}</span>
                  <Expand size={18} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        {reviews.length > STEP && (
          <div className={styles.moreWrap}>
            <button className="btn btn--ghost-light" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Свернуть" : `Показать ещё ${reviews.length - STEP}`}
            </button>
          </div>
        )}
      </div>
      {open !== null && <Lightbox items={items} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
