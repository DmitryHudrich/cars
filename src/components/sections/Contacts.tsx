import { asset } from "@/lib/asset";
import { site, telHref } from "@/data/site";
import styles from "./Contacts.module.css";

// TODO: заказчик думает над переделкой блока; карта — пока картинка, позже Яндекс.Карты.
export function Contacts() {
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
            {site.phones.map((p, i) => (
              <a key={i} href={telHref(p)} className={styles.link}>
                {p}
              </a>
            ))}
            <h3 className={`${styles.label} ${styles.gap}`}>Почта</h3>
            <a href={`mailto:${site.email}`} className={styles.link}>
              {site.email}
            </a>
          </div>

          <div className={styles.col}>
            <h3 className={styles.label}>Адреса офисов</h3>
            {site.offices.map((o) => (
              <a
                key={o.address}
                href={`https://yandex.ru/maps/?text=${encodeURIComponent(o.address)}`}
                target="_blank"
                rel="noopener"
                className={`${styles.link} ${o.main ? styles.accent : ""}`}
              >
                {o.address}
              </a>
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

      <div className={styles.map}>
        <img src={asset("/img/map-office.webp")} alt={`Карта: ${site.offices[0].address}`} loading="lazy" />
      </div>
    </section>
  );
}
