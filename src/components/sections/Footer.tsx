import { asset } from "@/lib/asset";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { site, telHref } from "@/data/site";
import styles from "./Footer.module.css";

const catalogLinks = [
  "Авто из Китая",
  "Авто из Кореи",
  "Авто из Японии",
  "Новое авто из Китая",
  "Новое авто из Кореи",
  "Новое авто из Японии",
];

const companyLinks = [
  { label: "О компании", href: "#how" },
  { label: "Гарантии", href: "#why" },
  { label: "Как купить", href: "#how" },
  { label: "Доставка авто", href: "#geo" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Блог", href: "#news" },
  { label: "Вопросы и ответы", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

export function Footer() {
  const office = site.offices[0];
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <img src={asset("/icons/logo-light.svg")} alt="Ранг Авто" width={200} height={45} />
          <p className={styles.desc}>
            Импорт автомобилей из Китая, Кореи и Японии с 2018 года. Помогаем выбрать, купить и доставить автомобиль
          </p>
          <dl className={styles.req}>
            <div>
              <dt>ООО</dt>
              <dd>«РАНГ АВТО»</dd>
            </div>
            <div>
              <dt>ИНН</dt>
              <dd>{site.inn}</dd>
            </div>
            <div>
              <dt>ОГРН</dt>
              <dd>{site.ogrn}</dd>
            </div>
          </dl>
          <div className={styles.socials}>
            <a href={site.socials.vk} target="_blank" rel="noopener" aria-label="ВКонтакте">
              <img src={asset("/icons/soc-vk.svg")} alt="" width={30} height={30} />
            </a>
            <a href={site.socials.telegram} target="_blank" rel="noopener" aria-label="Telegram">
              <img src={asset("/icons/soc-tg.svg")} alt="" width={30} height={30} />
            </a>
            <a href={site.socials.max} target="_blank" rel="noopener" aria-label="MAX">
              <img src={asset("/icons/soc-max.svg")} alt="" width={30} height={30} />
            </a>
          </div>
        </div>

        <nav className={styles.col} aria-label="Каталог автомобилей">
          <h3 className={styles.title}>Каталог автомобилей</h3>
          {catalogLinks.map((l) => (
            <a key={l} href="#catalog">
              {l}
            </a>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Компания">
          <h3 className={styles.title}>Компания</h3>
          {companyLinks.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.col}>
          <h3 className={styles.title}>Контакты</h3>
          <a href={telHref(site.phones[0])} className={styles.contact}>
            <span className={styles.ci}>
              <Phone size={16} />
            </span>
            <span>
              {site.phones[0]}
              <small>Бесплатно по РФ, 10:00-19:00 по МСК</small>
            </span>
          </a>
          <a href={`mailto:${site.email}`} className={styles.contact}>
            <span className={styles.ci}>
              <Mail size={16} />
            </span>
            <span>
              {site.email}
              <small>Для связи и сотрудничества</small>
            </span>
          </a>
          <a href="#contacts" className={styles.contact}>
            <span className={styles.ci}>
              <MapPin size={16} />
            </span>
            <span>
              <u>{office.address}</u>
              <small>Наш офис</small>
            </span>
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <span>© 2026 Ранг Авто</span>
          {/* TODO: страницы документов */}
          <a href="#">
            Пользовательское соглашение <ArrowRight size={14} />
          </a>
          <a href="#">
            Политика конфиденциальности <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
