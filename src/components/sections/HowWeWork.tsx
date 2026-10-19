import { asset } from "@/lib/asset";
import { LeadButton } from "@/components/lead/LeadModal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { workSteps } from "@/data/content";
import styles from "./HowWeWork.module.css";

export function HowWeWork() {
  return (
    <section className="section section--dark" id="how">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">[ Как мы работаем ]</p>
            <h2 className="h2">Ваш путь к новому автомобилю</h2>
          </div>
        </div>

        <RevealGroup as="ol" className={styles.grid}>
          {workSteps.map((s, i) => (
            <GlowCard as="li" key={s.title} className={styles.card}>
              <span className={styles.icon}>
                <Icon name={s.icon} size={17} />
              </span>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.text}>{s.text}</p>
              <span className={styles.step}>
                <i className="num-badge">{String(i + 1).padStart(2, "0")}</i>
              </span>
            </GlowCard>
          ))}

          <GlowCard as="li" className={styles.cta}>
            <span className={styles.stripes} aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <img className={styles.car} src={asset("/img/cta-car.webp")} alt="" loading="lazy" />
            <img className={styles.manager} src={asset("/img/cta-manager.webp")} alt="" loading="lazy" />
            <div className={styles.ctaBody}>
              <h3 className={styles.title}>Готовы сделать первый шаг?</h3>
              <p className={styles.text}>
                Оставьте заявку — бесплатно рассчитаем стоимость вашего будущего автомобиля в течении часа.
              </p>
              <LeadButton source="how-we-work" className={`btn btn--gold ${styles.ctaBtn}`}>
                Оставить заявку
              </LeadButton>
            </div>
          </GlowCard>
        </RevealGroup>
      </div>
    </section>
  );
}
