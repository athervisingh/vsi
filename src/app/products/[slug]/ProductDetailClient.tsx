"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "./product.module.css";

type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  extra_price: number;
  is_active: boolean;
};

type ProductImage = {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
};

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    base_price: number;
    brand: string | null;
  };
  images: ProductImage[];
  variants: Variant[];
  category: { id: string; name: string; slug: string } | null;
  avgRating: number;
  reviewCount: number;
};

const FALLBACK = "/placeholder.png";

export default function ProductDetailClient({
  product,
  images,
  variants,
  avgRating,
  reviewCount,
}: Props) {
  const { addToCart } = useCart();

  const mainImage = images[0]?.url ?? FALLBACK;
  const [activeImage, setActiveImage] = useState(mainImage);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length === 1 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Unique sizes and colors
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[];

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);

  // Auto-select variant when size+color change
  function getMatchingVariant(size: string | null, color: string | null) {
    return variants.find((v) => {
      const sizeMatch = sizes.length === 0 || v.size === size;
      const colorMatch = colors.length === 0 || v.color === color;
      return sizeMatch && colorMatch;
    }) ?? null;
  }

  function handleSizeSelect(size: string) {
    setSelectedSize(size);
    setSelectedVariant(getMatchingVariant(size, selectedColor));
  }

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    setSelectedVariant(getMatchingVariant(selectedSize, color));
  }

  const finalVariant = selectedVariant ?? (variants.length === 0 ? null : variants[0]);
  const finalPrice = product.base_price + (finalVariant?.extra_price ?? 0);
  const originalPrice = Math.round(finalPrice * 1.25);
  const discount = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

  function handleAddToCart() {
    addToCart({
      variant_id: finalVariant?.id ?? product.id,
      product_id: product.id,
      product_name: product.name,
      price: finalPrice,
      image: activeImage,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className={styles.productSection}>
      {/* ── Image Column ── */}
      <div className={styles.imageCol}>
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img) => (
              <button
                key={img.id}
                className={`${styles.thumb} ${activeImage === img.url ? styles.thumbActive : ""}`}
                onClick={() => setActiveImage(img.url)}
              >
                <Image src={img.url} alt="" fill sizes="64px" style={{ objectFit: "contain", padding: 4 }} />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className={styles.mainImageBox}>
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.mainImage}
            priority
          />
          <span className={styles.discountTag}>-{discount}%</span>
        </div>
      </div>

      {/* ── Info Column ── */}
      <div className={styles.infoCol}>

        {/* Brand */}
        {product.brand && (
          <span className={styles.brandName}>
            {product.brand}
          </span>
        )}

        {/* Name */}
        <h1 className={styles.productName}>{product.name}</h1>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <StarRow rating={avgRating} size={16} />
          <span className={styles.ratingNum}>{avgRating > 0 ? avgRating.toFixed(1) : "No ratings"}</span>
          <span className={styles.ratingCount}>
            {reviewCount > 0 ? `(${reviewCount} review${reviewCount !== 1 ? "s" : ""})` : ""}
          </span>
          <span className={styles.ratingDivider}>|</span>
          <a href="#reviews" className={styles.reviewsAnchor}>See all reviews</a>
        </div>

        <div className={styles.priceDivider} />

        {/* Price */}
        <div className={styles.priceBlock}>
          <span className={styles.currentPrice}>₹{finalPrice.toLocaleString("en-IN")}</span>
          <span className={styles.originalPrice}>₹{originalPrice.toLocaleString("en-IN")}</span>
          <span className={styles.saveBadge}>Save {discount}%</span>
        </div>
        <p className={styles.taxNote}>Inclusive of all taxes. Free delivery.</p>

        <div className={styles.priceDivider} />

        {/* Color Variants */}
        {colors.length > 0 && (
          <div className={styles.variantGroup}>
            <p className={styles.variantLabel}>
              Color: <strong>{selectedColor}</strong>
            </p>
            <div className={styles.colorOptions}>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorChip} ${selectedColor === color ? styles.colorChipActive : ""}`}
                  onClick={() => handleColorSelect(color)}
                  style={{ background: COLOR_MAP[color.toLowerCase()] ?? "#e2e8f0" }}
                  title={color}
                >
                  {selectedColor === color && <CheckMark />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Variants */}
        {sizes.length > 0 && (
          <div className={styles.variantGroup}>
            <p className={styles.variantLabel}>
              Size: <strong>{selectedSize}</strong>
            </p>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizePill} ${selectedSize === size ? styles.sizePillActive : ""}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Variants Table */}
        {variants.length > 0 && (
          <div className={styles.variantGroup}>
            <p className={styles.variantLabel}>All Variants</p>
            <div className={styles.variantsTable}>
              {variants.map((v) => {
                const isSelected = finalVariant?.id === v.id;
                const vPrice = product.base_price + v.extra_price;
                return (
                  <button
                    key={v.id}
                    className={`${styles.variantRow} ${isSelected ? styles.variantRowActive : ""}`}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.size) setSelectedSize(v.size);
                      if (v.color) setSelectedColor(v.color);
                    }}
                  >
                    <span className={styles.variantInfo}>
                      {[v.size, v.color].filter(Boolean).join(" / ") || v.sku}
                    </span>
                    <span className={styles.variantPrice}>₹{vPrice.toLocaleString("en-IN")}</span>
                    {isSelected && <span className={styles.variantCheck}><CheckMark /></span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className={styles.qtyGroup}>
          <p className={styles.variantLabel}>Quantity</p>
          <div className={styles.qtyRow}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span className={styles.qtyNum}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaRow}>
          <button
            className={`${styles.addToCartBtn} ${added ? styles.addedBtn : ""}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <><CheckMark /> Added to Cart</>
            ) : (
              <><CartIcon /> Add to Cart</>
            )}
          </button>
          <button className={styles.buyNowBtn}>
            Buy Now
          </button>
        </div>

        {/* Delivery Info */}
        <div className={styles.deliveryInfo}>
          <div className={styles.deliveryRow}>
            <TruckIcon />
            <div>
              <p className={styles.deliveryTitle}>Free Delivery</p>
              <p className={styles.deliverySub}>On orders above ₹499</p>
            </div>
          </div>
          <div className={styles.deliveryRow}>
            <ReturnIcon />
            <div>
              <p className={styles.deliveryTitle}>Easy Returns</p>
              <p className={styles.deliverySub}>7-day return policy</p>
            </div>
          </div>
          <div className={styles.deliveryRow}>
            <ShieldIcon />
            <div>
              <p className={styles.deliveryTitle}>Genuine Product</p>
              <p className={styles.deliverySub}>100% authentic guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  black: "#1e1e1e",
  white: "#f1f5f9",
  yellow: "#eab308",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#a855f7",
  grey: "#94a3b8",
  gray: "#94a3b8",
  brown: "#92400e",
  navy: "#1e3a8a",
};

function StarRow({ rating, size }: { rating: number; size: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i + 0.5 <= rating;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`cl_${size}_${i}`}>
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={filled ? "#f59e0b" : half ? `url(#cl_${size}_${i})` : "#d1d5db"}
              stroke="none"
            />
          </svg>
        );
      })}
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--accent)" }}>
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--accent)" }}>
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--accent)" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
