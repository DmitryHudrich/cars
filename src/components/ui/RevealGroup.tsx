"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

// Каждый ребёнок плавно появляется, когда сам доезжает до экрана (стили — .reveal-group в globals.css).
// Карточки, попавшие в экран одновременно, появляются по очереди. Уже видимые при загрузке — не прячем.
export function RevealGroup<T extends ElementType = "div">({
  as,
  className,
  ...props
}: { as?: T } & ComponentPropsWithoutRef<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const items = [...el.children] as HTMLElement[];
    const hidden = items.filter((c) => c.getBoundingClientRect().top > window.innerHeight * 0.92);
    if (!hidden.length) return;
    hidden.forEach((c) => (c.dataset.reveal = "hidden"));

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const c = e.target as HTMLElement;
          c.style.setProperty("--reveal-delay", `${n++ * 110}ms`);
          c.dataset.reveal = "shown";
          io.unobserve(c);
        }
        // карточки, через которые проскочили (переход по якорю), тоже показываем
        for (const c of hidden) {
          if (c.dataset.reveal === "hidden" && c.getBoundingClientRect().top < window.innerHeight) {
            c.dataset.reveal = "shown";
            io.unobserve(c);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    hidden.forEach((c) => io.observe(c));

    // переход по якорю мимо блока: карточки над экраном показываем без ожидания
    const onScroll = () => {
      for (const c of hidden) {
        if (c.dataset.reveal === "hidden" && c.getBoundingClientRect().bottom < 0) {
          c.dataset.reveal = "shown";
          io.unobserve(c);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <Tag ref={ref} {...props} className={`reveal-group ${className ?? ""}`} />;
}
