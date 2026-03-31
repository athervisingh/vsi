import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Virat Sports Industries",
  description:
    "Get in touch with Virat Sports Industries on WhatsApp or email for product and support inquiries.",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Contact Us</p>
        <h1>Let us help you choose the right sports equipment</h1>
        <p>
          Reach our team directly for product details, bulk orders, and support.
          We usually respond quickly on WhatsApp.
        </p>
      </section>

      <section className={styles.cardGrid} aria-label="Contact methods">
        <article className={styles.card}>
          <h2>WhatsApp</h2>
          <p className={styles.detail}>9217661807</p>
          <a
            href="https://wa.me/919217661807"
            target="_blank"
            rel="noreferrer"
            className={styles.primaryButton}
          >
            Chat on WhatsApp
          </a>
        </article>

        <article className={styles.card}>
          <h2>Email</h2>
          <p className={styles.detail}>info@viratsports.com</p>
          <a href="mailto:info@viratsports.com" className={styles.secondaryButton}>
            Send Email
          </a>
        </article>
      </section>
    </main>
  );
}