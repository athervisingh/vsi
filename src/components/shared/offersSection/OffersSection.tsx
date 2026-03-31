"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./offersSection.module.css";

/* ─── Types ──────────────────────────────────────────── */
export type Offer = {
  id: number;
  tag: string;          // e.g. "Flash Sale", "Weekend Deal"
  discount: string;     // e.g. "30%", "₹500", "Buy 1 Get 1"
  discountSuffix?: string; // e.g. "OFF", "FREE" — defaults to "OFF"
  heading: string;      // e.g. "Cricket Gear"
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  color?: "orange" | "blue" | "green" | "red";
};

type Props = {
  eyebrow?: string;
  title?: string;
  offers: Offer[];
};

/* ─── Section ────────────────────────────────────────── */
export default function OffersSection({
  eyebrow = "Limited Time",
  title = "Exclusive Deals",
  offers,
}: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.titleLine} />
      </div>

      <div className={styles.grid}>
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

/* ─── Card ───────────────────────────────────────────── */
function OfferCard({ offer }: { offer: Offer }) {
  const color = offer.color ?? "orange";

  return (
    <div className={`${styles.card} ${styles[`card_${color}`]}`}>

      {/* ── Top: colored band with discount + image ── */}
      <div className={`${styles.cardTop} ${styles[`top_${color}`]}`}>

        {/* Tag badge */}
        <span className={styles.tag}>{offer.tag}</span>

        {/* Discount block */}
        <div className={styles.discountBlock}>
          <span className={styles.discount}>{offer.discount}</span>
          <span className={styles.discountSuffix}>
            {offer.discountSuffix ?? "OFF"}
          </span>
        </div>

        <p className={styles.description}>{offer.description}</p>

        {/* Product image — floats right */}
        <div className={styles.imageWrapper}>
          <Image
            src={offer.image}
            alt={offer.heading}
            width={160}
            height={160}
            className={styles.image}
          />
        </div>
      </div>

      {/* ── Bottom: heading + CTA ── */}
      <div className={styles.cardBottom}>
        <div className={styles.bottomLeft}>
          <span className={styles.heading}>{offer.heading}</span>
        </div>
        <Link
          href={offer.ctaLink ?? "/products"}
          className={`${styles.ctaBtn} ${styles[`cta_${color}`]}`}
        >
          {offer.ctaText ?? "Shop Now"}
          <ArrowRight />
        </Link>
      </div>

    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
