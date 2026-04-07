"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./categoryGrid.module.css";
import type { Category } from "@/types";

type Props = {
  eyebrow?: string;
  title?: string;
  categories: Category[];
};

const PLACEHOLDER_COLORS = [
  "linear-gradient(135deg, #1e3a5f, #0f2340)",
  "linear-gradient(135deg, #3d1a1a, #5c2020)",
  "linear-gradient(135deg, #1a3d2b, #0f2e1c)",
  "linear-gradient(135deg, #2d1f4e, #1a1030)",
  "linear-gradient(135deg, #3d2e1a, #261c0a)",
];

export default function CategoryGrid({
  eyebrow = "Browse",
  title = "Shop By Sport",
  categories,
}: Props) {
  const featured = categories.slice(0, 5);
  const extra = categories.slice(5);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {/* ── Main 5-card grid ── */}
      <div className={styles.grid}>
        {featured.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={`${styles.card} ${i === 0 ? styles.featured : ""}`}
            style={!cat.image_url ? { background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] } : undefined}
          >
            {cat.image_url && (
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className={styles.overlay} />
            <div className={styles.content}>
              <h3 className={styles.name}>{cat.name}</h3>
              <span className={styles.cta}>
                Explore
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Extra categories grid ── */}
      {extra.length > 0 && (
        <div className={styles.extraSection}>
          <h3 className={styles.sectionSubtitle}>All Categories</h3>
          <div className={styles.categoryGrid}>
            {extra.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={styles.categoryGridCard}
                style={!cat.image_url ? { background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] } : undefined}
              >
                {/* Background with gradient or image */}
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div
                    className={styles.cardImage}
                    style={{
                      background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length],
                    }}
                  />
                )}

                {/* Content overlay */}
                <div className={styles.cardOverlay} />

                {/* Text content */}
                <div className={styles.cardInfo}>
                  <h4 className={styles.cardTitle}>{cat.name}</h4>
                  <span className={styles.cardCta}>
                    Shop Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>

              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
