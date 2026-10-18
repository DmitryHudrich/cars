"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function SliderArrows({
  canPrev,
  canNext,
  onStep,
}: {
  canPrev: boolean;
  canNext: boolean;
  onStep: (dir: 1 | -1) => void;
}) {
  return (
    <div className="arrows">
      <button className="arrow-btn" onClick={() => onStep(-1)} disabled={!canPrev} aria-label="Назад">
        <ChevronLeft size={20} />
      </button>
      <button className="arrow-btn" onClick={() => onStep(1)} disabled={!canNext} aria-label="Вперёд">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
