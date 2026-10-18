"use client";

import { ArrowRight } from "lucide-react";
import { SliderArrows } from "@/components/ui/SliderArrows";
import { news } from "@/data/content";
import { useScroller } from "@/lib/useScroller";
import styles from "./News.module.css";

// TODO: формат блока новостей обсуждается с заказчиком; пока — лента карточек в стиле сайта.
export function News() {
  const { trackRef, canPrev, canNext, step } = useScroller();

  return (
    <section className="section section--white" id="news">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">[ Автоновости и блог ]</p>
            <h2 className="h2">Главное из мира автомобилей</h2>
          </div>
          <SliderArrows canPrev={canPrev} canNext={canNext} onStep={step} />
        </div>

        <div className={`track ${styles.track}`} ref={trackRef}>
          {news.map((n) => (
            <article key={n.title} className={styles.card}>
              <a href="#news" className={styles.link}>
                <div className={styles.photo}>
                  <img src={n.img} alt="" loading="lazy" draggable={false} />
                  <span className={styles.tag}>{n.tag}</span>
                </div>
                <div className={styles.body}>
                  <time className={styles.date}>{n.date}</time>
                  <h3 className={styles.title}>{n.title}</h3>
                  <p className={styles.text}>{n.text}</p>
                  <span className={styles.more}>
                    Читать <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
