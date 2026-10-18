import { Marquee } from "@/components/ui/Marquee";
import { banks } from "@/data/content";
import styles from "./Partners.module.css";

function BankRow() {
  return banks.map((b) => (
    <div key={b.name} className={styles.bank} style={{ width: b.w }}>
      <img src={b.logo} alt={b.name} width={b.w} height={66} loading="lazy" />
    </div>
  ));
}

export function Partners() {
  return (
    <section className={`section section--white ${styles.section}`} id="partners">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">[ Банки-партнёры ]</p>
            <h2 className="h2">Надёжные партнёры для вашей покупки</h2>
          </div>
        </div>
      </div>
      <div className={styles.rows}>
        <Marquee reverse duration={50}>
          <BankRow />
        </Marquee>
        <Marquee duration={50}>
          <BankRow />
        </Marquee>
      </div>
    </section>
  );
}
