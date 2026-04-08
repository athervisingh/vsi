"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./offersSection.module.css";

export type Offer = {
  id: number;
  tag: string;
  discount: string;
  discountSuffix?: string;
  heading: string;
  subheading?: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  couponCode?: string;
  color?: "orange" | "blue" | "green" | "red";
};

type Props = {
  eyebrow?: string;
  title?: string;
  offers: Offer[];
};

export default function OffersSection({
  eyebrow = "Limited Time",
  title = "Exclusive Deals",
  offers,
}: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>

        {/* ── Left Panel ── */}
        <div className={styles.leftPanel}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.panelTitle}>{title}</h2>
          <p className={styles.panelSub}>
            Use coupon codes at checkout and save on your favourite sports gear.
          </p>
          <Link href="/products" className={styles.shopBtn}>
            Shop Now
            <ArrowRight />
          </Link>
        </div>

        {/* ── Coupons ── */}
        <div className={styles.coupons}>
          {offers.map((offer) => (
            <CouponCard key={offer.id} offer={offer} />
          ))}
        </div>

      </div>
    </section>
  );
}

function CouponCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!offer.couponCode) return;
    navigator.clipboard.writeText(offer.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={styles.coupon}>
      {/* Notch circles */}
      <div className={styles.notchTop} />
      <div className={styles.notchBottom} />

      {/* Diagonal ribbon */}
      <div className={styles.ribbon}>
        <span className={styles.ribbonText}>COUPON</span>
      </div>

      {/* Dashed separator */}
      <div className={styles.separator} />

      {/* Content */}
      <div className={styles.couponContent}>

        <div className={styles.discountRow}>
          <span className={styles.upTo}>UP TO</span>
          <span className={styles.discountBig}>{offer.discount}</span>
          <span className={styles.offLabel}>{offer.discountSuffix ?? "OFF"}</span>
        </div>

        <p className={styles.condition}>{offer.description}</p>

        <div className={styles.useCodeRow}>
          <span className={styles.useCodeLabel}>USE CODE</span>
        </div>

        {offer.couponCode && (
          <div className={styles.codePill}>
            <span className={styles.codeText}>{offer.couponCode}</span>
            <button
              className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        )}

        <Link
          href={offer.ctaLink ?? "/products"}
          className={styles.cardLink}
        >
          {offer.ctaText ?? "Shop Now"} →
        </Link>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
