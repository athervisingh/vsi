"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./topThree.module.css";

export type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  brand: string | null;
  category_name: string;
  image: string;
};

type Props = {
  products: FeaturedProduct[];
};

export default function TopThree({ products }: Props) {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!products.length) return null;

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
            const originalPrice = Math.round(product.base_price * 1.25);
            const discount = Math.round(((originalPrice - product.base_price) / originalPrice) * 100);

            return (
              <div
                key={product.id}
                className={`${styles.card} ${styles[pos]}`}
                onClick={() => pos !== "active" && setActiveIndex(index)}
              >
                {/* Badge */}
                <span className={`${styles.badge} ${styles.badge_orange}`}>
                  {product.brand ?? "Featured"}
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
                  <span className={styles.category}>{product.category_name}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.description}>
                    {product.description ?? "Premium quality sports equipment for athletes."}
                  </p>

                  {/* Price */}
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{product.base_price.toLocaleString("en-IN")}</span>
                    <span className={styles.originalPrice}>₹{originalPrice.toLocaleString("en-IN")}</span>
                    <span className={styles.discount}>{discount}% OFF</span>
                  </div>

                  {/* CTA */}
                  <div className={styles.ctaRow}>
                    <button
                      className={styles.addCartBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          variant_id: product.id,
                          product_id: product.id,
                          product_name: product.name,
                          price: product.base_price,
                          image: product.image,
                        });
                      }}
                    >
                      <CartIcon /> Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className={styles.ctaBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Product
                    </Link>
                  </div>
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

function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
