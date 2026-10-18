"use client";

import { asset } from "@/lib/asset";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Menu, Search, X } from "lucide-react";
import { LeadButton } from "@/components/lead/LeadModal";
import { nav, site, telHref } from "@/data/site";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 46);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <p className={styles.promo}>Узнавайте первыми о новых поступлениях с выгодными ценами - в наших каналах</p>
          <div className={styles.topLinks}>
            <a href={site.socials.telegram} target="_blank" rel="noopener" className={styles.topLink}>
              <img src={asset("/icons/soc-tg.svg")} alt="" width={18} height={18} />
              Telegram
            </a>
            <a href={site.socials.max} target="_blank" rel="noopener" className={styles.topLink}>
              <img src={asset("/icons/soc-max.svg")} alt="" width={16} height={16} />
              MAX
            </a>
            <a href={telHref(site.phoneShort)} className={styles.topPhone}>
              {site.phoneShort}
            </a>
          </div>
        </div>
      </div>

      <header className={styles.header} data-scrolled={scrolled || undefined}>
        <div className={`container ${styles.inner}`}>
          <a href="#top" className={styles.logo} aria-label="Ранг Авто — на главную">
            <img src={asset("/icons/logo-dark.svg")} alt="Ранг Авто" width={200} height={40} />
          </a>

          <nav className={styles.nav} aria-label="Основное меню">
            {nav.map((item) => (
              <div key={item.label} className={styles.navItem}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                  {item.children && <ChevronDown size={16} className={styles.chev} />}
                </a>
                {item.children && (
                  <div className={styles.dropdown}>
                    {item.children.map((c) => (
                      <a key={c.label} href={c.href}>
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className={styles.actions}>
            {/* TODO: поиск и избранное — после появления каталога */}
            <a href="#catalog" className={styles.iconBtn} aria-label="Поиск по каталогу">
              <Search size={20} />
            </a>
            <a href="#catalog" className={styles.iconBtn} aria-label="Избранное">
              <Heart size={20} />
            </a>
            <LeadButton source="header" title="Заказать звонок" submitLabel="Жду звонка" className={`btn btn--gold ${styles.cta}`}>
              Заказать звонок
            </LeadButton>
            <button className={styles.burger} onClick={() => setOpen(true)} aria-label="Открыть меню">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.mobile} data-open={open || undefined} aria-hidden={!open}>
        <div className={styles.mobileHead}>
          <img src={asset("/icons/logo-light.svg")} alt="Ранг Авто" width={160} height={36} />
          <button onClick={() => setOpen(false)} aria-label="Закрыть меню" className={styles.mobileClose}>
            <X size={28} />
          </button>
        </div>
        <nav className={styles.mobileNav} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          {nav.map((item) => (
            <div key={item.label}>
              <a href={item.href} className={styles.mobileLink}>
                {item.label}
              </a>
              {item.children?.map((c) => (
                <a key={c.label} href={c.href} className={styles.mobileSub}>
                  {c.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className={styles.mobileFoot}>
          <a href={telHref(site.phoneShort)} className={styles.mobilePhone}>
            {site.phoneShort}
          </a>
          <LeadButton source="mobile-menu" title="Заказать звонок" submitLabel="Жду звонка" className="btn btn--gold">
            Заказать звонок
          </LeadButton>
        </div>
      </div>
    </>
  );
}
