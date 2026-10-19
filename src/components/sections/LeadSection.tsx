"use client";

import { useState } from "react";
import { formatPhone, isPhoneComplete, useLeadSubmit } from "@/lib/lead";
import { site } from "@/data/site";
import styles from "./LeadSection.module.css";

export function LeadSection() {
  const { status, submit } = useLeadSubmit("personal-selection");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isPhoneComplete(phone)) {
      setPhoneError(true);
      return;
    }
    const fd = new FormData(e.currentTarget);
    const fields: Record<string, string> = {};
    fd.forEach((v, k) => (fields[k] = String(v)));
    submit({ ...fields, phone });
  }

  return (
    <section className={styles.section} id="lead">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.info}>
            <p className="eyebrow">[ Персональный подбор ]</p>
            <h2 className="h2">
              Найдём автомобиль <br />
              под ваш бюджет
            </h2>
            <p className={styles.text}>
              Подберём подходящие автомобили из Китая, Кореи и Японии, сравним предложения и рассчитаем полную стоимость
            </p>
            <p className={styles.small}>
              Или свяжитесь с нами в{" "}
              <a href={site.socials.telegram} target="_blank" rel="noopener">
                Telegram
              </a>{" "}
              или{" "}
              <a href={site.socials.max} target="_blank" rel="noopener">
                MAX
              </a>
            </p>
          </div>

          <div className={styles.formWrap}>
            {status === "done" ? (
              <div className={styles.done}>
                <h3>Заявка отправлена</h3>
                <p>Спасибо! Менеджер свяжется с вами и пришлёт подборку автомобилей.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={onSubmit} noValidate>
                <input className={styles.wide} name="name" placeholder="Ваше имя" autoComplete="name" aria-label="Ваше имя" />
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 (999) 999-99-99"
                  aria-label="Телефон"
                  value={phone}
                  data-error={phoneError || undefined}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    setPhoneError(false);
                  }}
                />
                <input name="budget" placeholder="Бюджет" aria-label="Бюджет" />
                <input name="city" placeholder="Город" autoComplete="address-level2" aria-label="Город" />
                <select name="contact" defaultValue="" aria-label="Как с вами связаться?">
                  <option value="" disabled>
                    Как с вами связаться?
                  </option>
                  <option>Позвонить</option>
                  <option>Telegram</option>
                  <option>MAX</option>
                  <option>WhatsApp</option>
                </select>
                <input
                  className={styles.wide}
                  name="wishes"
                  placeholder="Пожелания: марка, модель"
                  aria-label="Пожелания к автомобилю"
                />
                {phoneError && <p className={`${styles.wide} ${styles.error}`}>Введите номер телефона полностью</p>}
                <button className={`btn btn--gold ${styles.wide} ${styles.submit}`} disabled={status === "sending"}>
                  {status === "sending" ? "Отправляем…" : "Получить подборку автомобилей"}
                </button>
                {status === "error" && (
                  <p className={`${styles.wide} ${styles.error}`}>Не удалось отправить. Попробуйте ещё раз.</p>
                )}
                <label className={`${styles.wide} ${styles.consent}`}>
                  <input type="checkbox" required defaultChecked />
                  Отправляя форму, вы соглашаетесь с политикой обработки персональных данных
                </label>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
