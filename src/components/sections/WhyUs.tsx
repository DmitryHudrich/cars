"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { SliderArrows } from "@/components/ui/SliderArrows";
import { reasons } from "@/data/content";
import { useScroller } from "@/lib/useScroller";
import styles from "./WhyUs.module.css";

export function WhyUs() {
  const { trackRef, canPrev, canNext, progress, visible, step } = useScroller();
  // ширина «ползунка» = доля видимой области, позиция = прогресс прокрутки
  const thumb = Math.min(1, visible);

  return (
    <section className="section section--white" id="why">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow" aria-hidden />
            <h2 className="h2">Покупка автомобиля без сложностей</h2>
          </div>
          <SliderArrows canPrev={canPrev} canNext={canNext} onStep={step} />
        </div>

        <div className={`track ${styles.track}`} ref={trackRef}>
          {reasons.map((r, i) => (
            <GlowCard key={i} className={styles.card}>
              <div className={styles.top}>
                <span className={styles.icon}>
                  <Icon name={r.icon} size={18} />
                </span>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className={styles.title}>{r.title}</h3>
              <p className={styles.text}>{r.text}</p>
            </GlowCard>
          ))}
        </div>

        <div className={styles.progress} aria-hidden>
          <span
            style={{
              width: `${thumb * 100}%`,
              transform: `translateX(${(progress * (1 - thumb) * 100) / thumb}%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
