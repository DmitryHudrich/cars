"use client";

import { useState } from "react";
import { countries, type CountryId } from "@/data/content";
import styles from "./HeroSearch.module.css";

// TODO: марки/модели будут приходить из API каталога
const brands: Record<CountryId, string[]> = {
  cn: ["BYD", "Chery", "Geely", "Haval", "Li Auto", "Zeekr", "Volkswagen", "Toyota"],
  kr: ["Hyundai", "Kia", "Genesis", "BMW", "Mercedes-Benz"],
  jp: ["Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Lexus"],
};

const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));
const budgets = ["1 500 000 ₽", "2 000 000 ₽", "3 000 000 ₽", "4 000 000 ₽", "5 000 000 ₽", "7 000 000 ₽"];

export const CATALOG_FILTER_EVENT = "catalog:filter";

export function HeroSearch() {
  const [country, setCountry] = useState<CountryId>("cn");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(CATALOG_FILTER_EVENT, { detail: { country } }));
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form className={styles.panel} onSubmit={onSubmit}>
      <div className={styles.tabs} role="tablist" aria-label="Страна">
        {countries.map((c) => (
          <button
            type="button"
            role="tab"
            key={c.id}
            aria-selected={country === c.id}
            className={styles.tab}
            onClick={() => setCountry(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <label className={styles.select}>
          <span className="visually-hidden">Марка</span>
          <select name="brand" defaultValue="" key={country}>
            <option value="">Любая марка</option>
            {brands[country].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={styles.select}>
          <span className="visually-hidden">Модель</span>
          <select name="model" defaultValue="" disabled>
            <option value="">Любая модель</option>
          </select>
        </label>
        <label className={`${styles.select} ${styles.short}`}>
          <span className="visually-hidden">Год от</span>
          <select name="year" defaultValue="">
            <option value="">Год от</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
        <label className={`${styles.select} ${styles.short}`}>
          <span className="visually-hidden">Бюджет до</span>
          <select name="budget" defaultValue="">
            <option value="">Бюджет до</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <button className={`btn btn--gold ${styles.submit}`}>Показать авто</button>
      </div>

      <label className={styles.check}>
        <input type="checkbox" name="lowFee" />
        <span>
          Только с льготным утильсбором
          <small>авто до 160 л.с. - экономия до 900 тыс. ₽</small>
        </span>
      </label>
    </form>
  );
}
