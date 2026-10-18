"use client";

import { useCallback, useEffect, useState } from "react";

// Горизонтальная лента со scroll-snap: стрелки, прогресс, перетаскивание мышью.
export function useScroller<T extends HTMLElement = HTMLDivElement>() {
  // callback-ref через state: эффект перезапускается, когда элемент смонтирован
  const [el, ref] = useState<T | null>(null);
  const [state, setState] = useState({ canPrev: false, canNext: true, progress: 0, visible: 1 });

  const update = useCallback(() => {
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      canPrev: el.scrollLeft > 2,
      canNext: el.scrollLeft < max - 2,
      progress: max > 0 ? el.scrollLeft / max : 1,
      visible: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
    });
  }, [el]);

  useEffect(() => {
    if (!el) return;
    // ResizeObserver вызывает update сразу после observe — начальное состояние тоже отсюда
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    // drag-to-scroll для мыши
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.dataset.dragging = "";
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        delete el.dataset.dragging;
        // гасим клик после перетаскивания
        el.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
        setTimeout(() => el.dispatchEvent(new Event("scroll")), 0);
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      el.removeEventListener("scroll", update);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      ro.disconnect();
    };
  }, [el, update]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!el) return;
      const first = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const w = first ? first.offsetWidth + gap : el.clientWidth;
      el.scrollBy({ left: dir * w, behavior: "smooth" });
    },
    [el],
  );

  return { trackRef: ref, ...state, step };
}
