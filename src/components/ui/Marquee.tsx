import type { CSSProperties, ReactNode } from "react";
import styles from "./Marquee.module.css";

// Бесконечная бегущая строка: контент дублируется и сдвигается на половину ширины.
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  gap = 20,
  pauseOnHover = true,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  gap?: number;
  pauseOnHover?: boolean;
  className?: string;
}) {
  const style = { "--duration": `${duration}s`, "--gap": `${gap}px` } as CSSProperties;
  return (
    <div
      className={`${styles.marquee} ${pauseOnHover ? styles.pausable : ""} ${className ?? ""}`}
      data-reverse={reverse || undefined}
      style={style}
    >
      <div className={styles.track}>
        <div className={styles.group}>{children}</div>
        <div className={styles.group} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
