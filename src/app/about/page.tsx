import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us | Virat Sports Industries",
  description:
    "Learn about Virat Sports Industries, our mission, vision, and commitment to quality sports equipment and court solutions.",
};

const highlights = [
  { label: "Established", value: "2015" },
  { label: "Industry Experience", value: "20+ Years" },
  { label: "Primary Focus", value: "Sports Equipment and Courts" },
  { label: "Operating Model", value: "Manufacturing and Supply" },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.kicker}>About Us</p>
          <h1>Virat Sports Industries</h1>
          <p>
            An ISO 9001:2015 certified company founded in 2015, Virat Sports
            Industries builds and supplies sports and fitness equipment,
            construction solutions, and indoor and outdoor game flooring.
          </p>
          <p>
            The company is led by Vikas Kumar Pandey, NIS Coach (Retd.) with
            over two decades of practical expertise in sports and fitness.
          </p>
        </div>
      </section>

      <section className={styles.highlights} aria-label="Company highlights">
        {highlights.map((item) => (
          <article key={item.label} className={styles.highlightCard}>
            <h2>{item.value}</h2>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.contentCard}>
          <h2>Our Aim</h2>
          <p>
            We work hard and strive for perfection by aligning our products and
            service standards with recognized international benchmarks.
          </p>
        </article>

        <article className={styles.contentCard}>
          <h2>Our Vision</h2>
          <p>
            To be a world-class sporting goods manufacturer and sports court
            development company, trusted by institutions, businesses, and
            athletes for consistent quality and dependable service.
          </p>
        </article>

        <article className={styles.contentCard}>
          <h2>Our Mission</h2>
          <p>
            To design and deliver innovative sporting products through a
            customer-first culture, high-performing teams, and continuous
            improvement in manufacturing and execution.
          </p>
        </article>

        <article className={styles.contentCard}>
          <h2>Why Virat Sports</h2>
          <p>
            Our management and engineering teams bring deep experience in
            production, playing court construction, and customer support. We use
            updated tools, modern processes, and buyer feedback to keep improving
            quality, reliability, and product performance.
          </p>
        </article>
      </section>
    </main>
  );
}