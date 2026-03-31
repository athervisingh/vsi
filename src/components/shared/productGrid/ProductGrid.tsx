"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./productGrid.module.css";

/* ─── Types ──────────────────────────────────────────── */
export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: "orange" | "blue" | "green" | "red";
  slug: string;
  default_variant_id?: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  viewAllLink?: string;
  products: Product[];
  compact?: boolean;
};

/* ─── Section ────────────────────────────────────────── */
export default function ProductGrid({
  eyebrow,
  title,
  viewAllLink,
  products,
  compact = false,
}: Props) {
  return (
    <section className={compact ? styles.sectionCompact : styles.section}>
      {!compact && (
        <div className={styles.sectionHeader}>
          <div className={styles.titleGroup}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <h2 className={styles.title}>{title}</h2>
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className={styles.viewAll}>
              View All
              <ArrowRight />
            </Link>
          )}
        </div>
      )}

      <div className={compact ? styles.gridCompact : styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

/* ─── Product Card ───────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.default_variant_id) {
      router.push(`/products/${product.slug}`);
      return;
    }
    addToCart({
      variant_id: product.default_variant_id,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>

      {/* Image */}
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {product.badge && (
          <span
            className={`${styles.badge} ${
              styles[`badge_${product.badgeColor ?? "orange"}`]
            }`}
          >
            {product.badge}
          </span>
        )}

        {discount && (
          <span className={styles.discountPill}>-{discount}%</span>
        )}

        {/* Hover overlay with quick-add */}
        <div className={styles.hoverOverlay}>
          <button className={styles.quickAdd} onClick={handleAddToCart}>
            <CartIcon />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>

        {/* Stars */}
        <div className={styles.ratingRow}>
          <Stars rating={product.rating} />
          <span className={styles.reviews}>({product.reviews})</span>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Stars ──────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            className={
              filled ? styles.starFilled : half ? styles.starHalf : styles.starEmpty
            }
          >
            <defs>
              <linearGradient id={`half_${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={half ? `url(#half_${i})` : "currentColor"}
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────── */
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

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
