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
            <p className="eyebrow">[ Отзывы клиентов ]</p>
            <h2 className="h2">Реальные отзывы</h2>
          </div>
        </div>

        <ul className={styles.grid} ref={gridRef}>
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
