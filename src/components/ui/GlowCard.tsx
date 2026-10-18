"use client";

import type { ComponentPropsWithoutRef, ElementType } from "react";

// Карточка с подсветкой краёв, которая следует за курсором (стили — .glow в globals.css).
export function GlowCard<T extends ElementType = "div">({
  as,
  className,
  ...props
}: { as?: T } & ComponentPropsWithoutRef<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      {...props}
      className={`glow ${className ?? ""}`}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    />
  );
}
