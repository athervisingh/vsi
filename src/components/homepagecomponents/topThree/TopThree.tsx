"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./topThree.module.css";

// TODO: Replace with API/DB call later
const products = [
  {
    id: 1,
    name: "Pro Cricket Bat",
    category: "Cricket",
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviews: 124,
    image: "/bat.png",
    badge: "Best Seller",
    badgeType: "orange",
    description: "Premium English willow bat crafted for professional players. Perfect grip, balanced weight.",
    slug: "pro-cricket-bat",
  },
  {
    id: 2,
    name: "Match Football",
    category: "Football",
    price: 1299,
    originalPrice: 1599,
    rating: 4.6,
    reviews: 89,
    image: "/football.png",
    badge: "Top Rated",
    badgeType: "blue",
    description: "FIFA approved match ball engineered for all weather conditions and professional play.",
    slug: "match-football",
  },
  {
    id: 3,
    name: "Pro Skate Board",
    category: "Skating",
    price: 3499,
    originalPrice: 4299,
    rating: 4.7,
    reviews: 67,
    image: "/skate.png",
    badge: "New Arrival",
    badgeType: "green",
    description: "High-performance skateboard built for tricks, street skating and aggressive riders.",
    slug: "pro-skate-board",
  },
];

export default function TopThree() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + products.length) % products.length);
  const next = () => setActiveIndex((i) => (i + 1) % products.length);

  const getPosition = (index: number) => {
    const total = products.length;
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return "active";
    if (diff === 1) return "right";
    return "left";
  };

  const active = products[activeIndex];

  return (
    <section className={styles.section}>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>Top Picks</span>
        <h2 className={styles.title}>Our Best Products</h2>
        <p className={styles.subtitle}>
          Handpicked gear trusted by athletes across India
        </p>
      </div>

      {/* 3D Slider */}
      <div className={styles.sliderWrapper}>
        <button className={styles.navBtn} onClick={prev} aria-label="Previous">
          <ChevronLeft />
        </button>

        <div className={styles.stage}>
          {products.map((product, index) => {
            const pos = getPosition(index);
            return (
              <div
                key={product.id}
                className={`${styles.card} ${styles[pos]}`}
                onClick={() => pos !== "active" && setActiveIndex(index)}
              >
                {/* Badge */}
                <span className={`${styles.badge} ${styles[`badge_${product.badgeType}`]}`}>
                  {product.badge}
                </span>

                {/* Product Image */}
                <div className={styles.imageWrapper}>
                  <div className={styles.imageGlow} />
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className={styles.productImage}
                    priority={index === activeIndex}
                  />
                </div>

                {/* Card Info */}
                <div className={styles.cardInfo}>
                  <span className={styles.category}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>

                  {/* Rating */}
                  <div className={styles.ratingRow}>
                    <div className={styles.stars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} filled={i < Math.round(product.rating)} />
                      ))}
                    </div>
                    <span className={styles.ratingText}>
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                    <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                    <span className={styles.discount}>
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* CTA */}
                  <Link href={`/products/${product.slug}`} className={styles.ctaBtn}>
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <button className={styles.navBtn} onClick={next} aria-label="Next">
          <ChevronRight />
        </button>
      </div>

      {/* Active product name below */}
      <div className={styles.activeInfo}>
        <p className={styles.activeName}>{active.name}</p>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {products.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f97316" : "none"} stroke="#f97316" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
