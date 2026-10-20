"use client";

import { useEffect } from "react";

// Плавное появление элементов страницы при прокрутке.
// Заголовки блоков и крупные элементы выезжают целиком, карточки в сетках и лентах — по очереди.
// Прячем только то, что при загрузке ниже экрана: без JS всё остаётся видимым.

// Сетки и ленты: анимируем каждую карточку
const STAGGER = [
  ".track > *",
  "#catalog [class*='grid'] > *",
  "#geo [class*='layout'] > *",
  "#faq ul > li",
  "#partners [class*='rows'] > *",
  "footer [class*='grid'] > *",
];

// Блоки со своей анимацией появления — не трогаем
const SKIP = ["#top", "#how ol", "#reviews ul"];

export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const main = document.querySelector("main");
    if (!main) return;

    const staggered = STAGGER.flatMap((s) => [...document.querySelectorAll<HTMLElement>(s)]);
    const skip = SKIP.flatMap((s) => [...document.querySelectorAll<HTMLElement>(s)]);
    const blocks = [...document.querySelectorAll<HTMLElement>("main > section .container > *, #office-map, #partners [class*='rows']")]
      .filter((el) => !skip.some((s) => s === el || s.contains(el) || el.contains(s)))
      .filter((el) => !staggered.some((c) => c === el || el.contains(c)));

    const targets = [...new Set([...blocks, ...staggered])].filter(
      (el) => !skip.some((s) => s.contains(el)) && el.getBoundingClientRect().top > window.innerHeight * 0.92,
    );
    targets.forEach((el) => (el.dataset.reveal = "hidden"));

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(n++, 6) * 90}ms`);
          el.dataset.reveal = "shown";
          io.unobserve(el);
        }
        // то, через что проскочили (переход по якорю), показываем сразу
        for (const el of targets) {
          if (el.dataset.reveal === "hidden" && el.getBoundingClientRect().bottom < 0) {
            el.dataset.reveal = "shown";
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => io.observe(el));

    const onScroll = () => {
      for (const el of targets) {
        if (el.dataset.reveal === "hidden" && el.getBoundingClientRect().bottom < 0) {
          el.dataset.reveal = "shown";
          io.unobserve(el);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
