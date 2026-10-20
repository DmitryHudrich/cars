"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, ChevronRight, Ship, Truck } from "lucide-react";
import { useLeadModal } from "@/components/lead/LeadModal";
import { CATALOG_FILTER_EVENT } from "./HeroSearch";
import { countries, geography } from "@/data/content";
import styles from "./Geography.module.css";

export function Geography() {
  const [active, setActive] = useState(0);
  const openLead = useLeadModal();
  const c = geography[active];
  const country = countries.find((x) => x.id === c.id)!;

  return (
    <section className="section section--dark" id="geo">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow" aria-hidden />
            <h2 className="h2">География поставок РАНГ АВТО</h2>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.map}>
            <div
              className={styles.stage}
              style={
                {
                  "--fx": c.mapFocus.focus[0],
                  "--fy": c.mapFocus.focus[1],
                  "--zoom": c.mapFocus.zoom,
                } as CSSProperties
              }
            >
              {/* у каждой страны своя карта с подсвеченным регионом — плавно сменяем их */}
              {[...new Set(geography.map((g) => g.map))].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={src === c.map ? `Карта поставок: ${c.name}` : ""}
                  className={styles.mapImg}
                  data-active={src === c.map || undefined}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Страна импорта">
            {geography.map((g, i) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={i === active}
                className={styles.tab}
                onClick={() => setActive(i)}
              >
                <img src={g.tabImg} alt="" loading="lazy" />
                <span className={styles.tabText}>
                  <b>{g.name}</b>
                  <span>{g.tabText}</span>
                </span>
                <span className={styles.tabArrow} aria-hidden>
                  <ChevronRight size={14} />
                </span>
              </button>
            ))}
          </div>

          <div className={styles.card} role="tabpanel" aria-live="polite">
            <div className={styles.cardInner} key={c.id}>
              <div className={styles.head}>
                <img src={country.flag} alt="" width={40} height={24} />
                <div>
                  <h3 className={styles.name}>{c.name}</h3>
                  <p className={styles.desc}>{c.description}</p>
                </div>
              </div>

              <ul className={styles.features}>
                {c.features.map((f, i) => (
                  <li key={f}>
                    <i className="num-badge">{String(i + 1).padStart(2, "0")}</i>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <ul className={styles.stats}>
                {c.stats.map((s) => (
                  <li key={s.label}>
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>

              <p className={styles.routesTitle}>Основные маршруты</p>
              <ul className={styles.routes}>
                {c.routes.map((r, i) => (
                  <li key={i}>
                    {r.kind === "truck" ? <Truck size={22} /> : <Ship size={22} />}
                    <span>{r.title}</span>
                    <small>{r.note}</small>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <a
                  href="#catalog"
                  className="btn btn--gold"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent(CATALOG_FILTER_EVENT, { detail: { country: c.id } }))
                  }
                >
                  Смотреть каталог из {country.genitive}
                  <ArrowRight size={14} />
                </a>
                <button
                  className="btn btn--ghost-light"
                  onClick={() =>
                    openLead({ source: `geo:${c.id}`, title: "Получить консультацию", submitLabel: "Получить консультацию" })
                  }
                >
                  Получить консультацию
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
