"use client";

import { useEffect, useState } from "react";
import { Heart, Info, TrendingDown } from "lucide-react";
import { LeadButton } from "@/components/lead/LeadModal";
import { cars, countries, type Car, type CountryId } from "@/data/content";
import { CATALOG_FILTER_EVENT } from "./HeroSearch";
import styles from "./CatalogPreview.module.css";

const rub = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";

export function CatalogPreview() {
  const [country, setCountry] = useState<CountryId>("cn");

  useEffect(() => {
    const onFilter = (e: Event) => setCountry((e as CustomEvent<{ country: CountryId }>).detail.country);
    window.addEventListener(CATALOG_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(CATALOG_FILTER_EVENT, onFilter);
  }, []);

  const list = cars.filter((c) => c.country === country);

  return (
    <section className="section section--light" id="catalog">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">[ Подбери себе авто ]</p>
            <h2 className="h2">
              Каталог автомобилей <br />с актуальными ценами
            </h2>
          </div>
          <div className={styles.tabs} role="tablist" aria-label="Страна">
            {countries.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={country === c.id}
                className={styles.tab}
                onClick={() => setCountry(c.id)}
              >
                <img src={c.flag} alt="" width={38} height={23} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {list.length ? (
          <div className={styles.grid} key={country}>
            {list.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          // TODO: убрать, когда каталог будет подключён к API
          <div className={styles.empty} key={country}>
            <p>Автомобили из этой страны скоро появятся в каталоге.</p>
            <LeadButton source="catalog-empty" title="Подобрать автомобиль под заказ" className="btn btn--gold">
              Подобрать под заказ
            </LeadButton>
          </div>
        )}

        <div className={styles.more}>
          <a href="#catalog" className="btn btn--outline">
            Смотреть весь каталог
          </a>
        </div>
      </div>
    </section>
  );
}

function CarCard({ car }: { car: Car }) {
  const [fav, setFav] = useState(false);
  const { market } = car;

  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        <img src={car.img} alt={car.title} loading="lazy" />
        <button
          className={styles.fav}
          aria-pressed={fav}
          aria-label="В избранное"
          onClick={() => setFav((v) => !v)}
        >
          <Heart size={16} fill={fav ? "currentColor" : "none"} />
        </button>
        <span className={styles.dots} aria-hidden>
          <i data-active />
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{car.title}</h3>
        <p className={styles.price}>{rub(car.price)}</p>
        <p className={styles.note}>под ключ с доставкой во Владивосток</p>
        {car.priceDrop && (
          <p className={styles.drop}>
            <TrendingDown size={12} />
            {car.priceDrop}
          </p>
        )}
        <p className={styles.specs}>{car.specs}</p>
        <button className={styles.decode}>
          Расшифровка цены <Info size={13} />
        </button>
        <div className={styles.market}>
          <div className={styles.marketLabels}>
            <span>{rub(market.min)}</span>
            <b data-tone={market.tone}>{market.label}</b>
            <span>{rub(market.max)}</span>
          </div>
          <div className={styles.scale}>
            <i style={{ left: `${market.position * 100}%` }} />
          </div>
        </div>
      </div>
    </article>
  );
}
