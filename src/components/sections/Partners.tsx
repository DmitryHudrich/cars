import type { CSSProperties } from "react";
import { Marquee } from "@/components/ui/Marquee";
import type { Partner } from "@/data/content";
import styles from "./Partners.module.css";

function BankRow({ banks }: { banks: Partner[] }) {
  return banks.map((b) => (
    <div key={b.name} className={styles.bank} style={{ "--w": `${b.w}px` } as CSSProperties}>
      <img src={b.logo} alt={b.name} width={b.w} height={66} />
    </div>
  ));
}

export function Partners({ banks }: { banks: Partner[] }) {
  return (
    <section className={`section section--white ${styles.section}`} id="partners">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow" aria-hidden />
            <h2 className="h2">Наши надёжные партнёры для вашей покупки</h2>
          </div>
        </div>
      </div>
      <div className={styles.rows}>
        <Marquee reverse duration={50} className={styles.row}>
          <BankRow banks={banks} />
        </Marquee>
        <Marquee duration={50} className={styles.row}>
          <BankRow banks={banks} />
        </Marquee>
      </div>
    </section>
  );
}
