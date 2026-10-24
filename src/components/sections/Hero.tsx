import { ArrowUpRight } from "lucide-react";
import { LeadButton } from "@/components/lead/LeadModal";
import { Icon } from "@/components/ui/Icon";
import type { HeroStat } from "@/data/content";
import type { CatalogBrands } from "@/lib/catalog";
import { HeroCountry } from "./HeroCountry";
import { HeroSearch } from "./HeroSearch";
import { ClientsStrip } from "./ClientsStrip";
import styles from "./Hero.module.css";

export function Hero({ heroStats, brands }: { heroStats: HeroStat[]; brands: CatalogBrands }) {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.bg} aria-hidden>
        <img src={"/img/hero.webp"} alt="Автомобили на складе Ранг Авто" fetchPriority="high" />
      </div>

      <div className={`container ${styles.content}`}>
        <p className={styles.kicker}>Импорт авто из Китая, Кореи и Японии с 2018 года</p>

        <HeroCountry />

        <p className={styles.lead}>
          Берём на себя все этапы покупки автомобиля за рубежом: от поиска, проверки и доставки до вашего города
        </p>

        <div className={styles.buttons}>
          <LeadButton source="hero" className={`${styles.btn} ${styles.btnPrimary}`}>
            Получить расчёт под ключ
            <ArrowUpRight size={22} />
          </LeadButton>
          <a href="#catalog" className={`${styles.btn} ${styles.btnGlass}`}>
            Смотреть каталог
            <ArrowUpRight size={22} />
          </a>
        </div>

        <ul className={styles.stats}>
          {heroStats.map((s) => (
            <li key={s.label} className={styles.stat}>
              <span className={styles.statIcon}>
                <Icon name={s.icon} size={24} />
              </span>
              <span>
                <b className={"accent" in s ? styles.accent : undefined}>{s.value}</b>
                <span className={styles.statLabel}>{s.label}</span>
              </span>
            </li>
          ))}
        </ul>

        <HeroSearch brands={brands} />
      </div>

      <ClientsStrip />
    </section>
  );
}
