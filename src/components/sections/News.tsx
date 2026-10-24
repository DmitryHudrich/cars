"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SliderArrows } from "@/components/ui/SliderArrows";
import type { Article } from "@/data/news";
import { useScroller } from "@/lib/useScroller";
import styles from "./News.module.css";

export function News({ news }: { news: Article[] }) {
  const { trackRef, canPrev, canNext, step } = useScroller();

  return (
    <section className="section section--white" id="news">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow" aria-hidden />
            <h2 className="h2">Главное из мира автомобилей</h2>
            <p className="section-sub">Публикуем всегда свежие новости</p>
          </div>
          <SliderArrows canPrev={canPrev} canNext={canNext} onStep={step} />
        </div>

        <div className={`track ${styles.track}`} ref={trackRef}>
          {news.map((n) => (
            <article key={n.slug} className={styles.card}>
              <Link href={`/news/${n.slug}`} className={styles.link}>
                <div className={styles.photo}>
                  <img src={n.img} alt={n.title} loading="lazy" draggable={false} />
                  <span className={styles.tag}>{n.tag}</span>
                </div>
                <div className={styles.body}>
                  <time className={styles.date}>{n.date}</time>
                  <h3 className={styles.title}>{n.title}</h3>
                  <p className={styles.text}>{n.excerpt}</p>
                  <span className={styles.more}>
                    Читать <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
