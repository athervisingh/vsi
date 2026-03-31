"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>

      {/* Background image with zoom-out animation */}
      <div className={styles.bgWrapper}>
        <Image
          src="/hero3.png"
          alt="Virat Sports Industries"
          fill
          priority
          className={styles.bgImage}
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      {/* Hero Content */}
      <div className={styles.content}>
        <p className={styles.eyebrow}>Welcome to</p>

        <h1 className={styles.title}>
          Virat Sports
          <span className={styles.titleBreak}>Industries</span>
        </h1>

        <div className={styles.divider} />

        <p className={styles.slogan}>The Power of Sports</p>

        <p className={styles.subText}>
          Gear up for greatness — premium sports equipment crafted for champions.
        </p>

        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryBtn}>
            Shop Now
            <ArrowIcon />
          </Link>
          <Link href="/about" className={styles.secondaryBtn}>
            Explore More
          </Link>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>

    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
