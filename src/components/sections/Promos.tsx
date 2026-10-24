"use client";

import { ArrowRight } from "lucide-react";
import { useLeadModal } from "@/components/lead/LeadModal";
import { SliderArrows } from "@/components/ui/SliderArrows";
import type { Promo } from "@/data/content";
import { useScroller } from "@/lib/useScroller";
import styles from "./Promos.module.css";

export function Promos({ promos }: { promos: Promo[] }) {
  const { trackRef, canPrev, canNext, step } = useScroller();
  const openLead = useLeadModal();

  return (
    <section className="section section--white" id="promo">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow" aria-hidden />
            <h2 className="h2">Акции и предложения</h2>
          </div>
          <SliderArrows canPrev={canPrev} canNext={canNext} onStep={step} />
        </div>

        <div className={`track track--bleed ${styles.track}`} ref={trackRef}>
          {promos.map((p) => (
            <article key={p.title} className={styles.card}>
              <div className={styles.photo}>
                <img src={p.img} alt={p.title} loading="lazy" draggable={false} />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.text}>{p.text}</p>
                <button
                  className={styles.more}
                  onClick={() =>
                    openLead({
                      source: `promo:${p.title}`,
                      title: p.title,
                      // TODO: условия акций — от заказчика
                      subtitle: "Оставьте контакты — менеджер расскажет об условиях акции и рассчитает стоимость автомобиля.",
                      submitLabel: "Узнать условия",
                    })
                  }
                >
                  Узнать условия <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
