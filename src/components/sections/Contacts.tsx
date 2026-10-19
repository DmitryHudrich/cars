"use client";

import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { asset } from "@/lib/asset";
import { site, telHref } from "@/data/site";
import styles from "./Contacts.module.css";

// Виджет Яндекс Карт не требует ключа. Тёмная тема — CSS-фильтром (см. .mapFrame).
function mapUrl([lat, lon]: number[]) {
  const ll = `${lon},${lat}`;
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=16&pt=${ll},pm2rdm`;
}

// TODO: заказчик думает над переделкой блока.
export function Contacts() {
  const [office, setOffice] = useState(0);
  // карта ловит колесо мыши — включаем её только по клику, чтобы не мешать прокрутке страницы
  const [active, setActive] = useState(false);
  const current = site.offices[office];

  return (
    <section className={styles.section} id="contacts">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">[ Контакты ]</p>
            <h2 className="h2">Свяжитесь с нами удобным способом</h2>
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h3 className={styles.label}>Телефон</h3>
            {site.offices.map((o, i) => (
              <a key={o.phone} href={telHref(o.phone)} className={styles.phone} data-active={i === office || undefined}>
                <span className={styles.link}>{o.phone}</span>
                <small>{o.city}</small>
              </a>
            ))}
            <h3 className={`${styles.label} ${styles.gap}`}>Почта</h3>
            <a href={`mailto:${site.email}`} className={styles.link}>
              {site.email}
            </a>
          </div>

          <div className={styles.col}>
            <h3 className={styles.label}>Адреса офисов</h3>
            {site.offices.map((o, i) => (
              <button
                key={o.address}
                type="button"
                className={styles.link}
                aria-pressed={i === office}
                onClick={() => {
                  setOffice(i);
                  setActive(false);
                  document.getElementById("office-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                {o.address}
              </button>
            ))}
            <h3 className={`${styles.label} ${styles.gap}`}>График работы</h3>
            <p className={styles.schedule}>
              {site.schedule.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.label}>Мессенджеры</h3>
            <div className={styles.socials}>
              <a href={site.socials.vk} target="_blank" rel="noopener" aria-label="ВКонтакте">
                <img src={asset("/icons/soc-vk.svg")} alt="" width={44} height={44} />
              </a>
              <a href={site.socials.telegram} target="_blank" rel="noopener" aria-label="Telegram">
                <img src={asset("/icons/soc-tg.svg")} alt="" width={44} height={44} />
              </a>
              <a href={site.socials.max} target="_blank" rel="noopener" aria-label="MAX">
                <img src={asset("/icons/soc-max.svg")} alt="" width={44} height={44} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.map} id="office-map" onMouseLeave={() => setActive(false)}>
        <iframe
          key={current.address}
          className={styles.mapFrame}
          src={mapUrl(current.coords)}
          title={`Карта: ${current.address}`}
          loading="lazy"
          allowFullScreen
        />
        {!active && (
          <button type="button" className={styles.mapShield} onClick={() => setActive(true)}>
            <span>
              <MousePointerClick size={18} />
              Нажмите, чтобы управлять картой
            </span>
          </button>
        )}
        <div className={styles.mapBadge}>
          <b>{current.city}</b>
          <span>{current.address}</span>
          <a href={telHref(current.phone)}>{current.phone}</a>
        </div>
      </div>
    </section>
  );
}
