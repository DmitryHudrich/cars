"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

// Дети плавно появляются по очереди, когда группа доезжает до экрана (стили — .reveal-group в globals.css).
// Прячем только если группа ещё ниже экрана: без JS всё остаётся видимым.
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
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        delete el.dataset.armed;
        el.dataset.shown = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <Tag ref={ref} {...props} className={`reveal-group ${className ?? ""}`} />;
}
