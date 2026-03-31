import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailClient from "./ProductDetailClient";
import styles from "./product.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  // Fetch product with all relations
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, description, base_price, brand, created_at,
      categories(id, name, slug),
      product_variants(id, sku, size, color, extra_price, is_active),
      product_images(id, url, is_primary, sort_order)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) notFound();

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, verified_purchase, created_at, user_id")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  // Fetch reviewer profiles separately (safe fallback if join fails)
  const reviewUserIds = (reviews ?? []).map((r: any) => r.user_id).filter(Boolean);
  const profileMap: Record<string, string> = {};
  if (reviewUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", reviewUserIds);
    (profiles ?? []).forEach((p: any) => {
      if (p.full_name) profileMap[p.id] = p.full_name;
    });
  }

  // Merge profile names into reviews
  const reviewsWithProfiles = (reviews ?? []).map((r: any) => ({
    ...r,
    profiles: { full_name: profileMap[r.user_id] ?? null },
  }));

  // Sort images: primary first
  const images: any[] = (product.product_images ?? []).sort((a: any, b: any) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const activeVariants = (product.product_variants ?? []).filter(
    (v: any) => v.is_active
  );

  const category: any = product.categories;

  // Avg rating
  const reviewList = reviewsWithProfiles;
  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewList.length
      : 0;

  return (
    <main className={styles.page}>
      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
        {category && (
          <>
            <span className={styles.breadcrumbSep}>›</span>
            <Link href={`/categories/${category.slug}`} className={styles.breadcrumbLink}>
              {category.name}
            </Link>
          </>
        )}
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      {/* ── Main Product Section ── */}
      <ProductDetailClient
        product={product}
        images={images}
        variants={activeVariants}
        category={category}
        avgRating={avgRating}
        reviewCount={reviewList.length}
      />

      {/* ── Product Details & Reviews ── */}
      <div className={styles.lowerSection}>

        {/* Description */}
        <section className={styles.descriptionBox}>
          <h2 className={styles.sectionHeading}>Product Description</h2>
          <p className={styles.descriptionText}>
            {product.description ?? "No description available for this product."}
          </p>
        </section>

        {/* Specifications */}
        <section className={styles.specsBox}>
          <h2 className={styles.sectionHeading}>Product Details</h2>
          <table className={styles.specsTable}>
            <tbody>
              {product.brand && (
                <tr>
                  <td className={styles.specKey}>Brand</td>
                  <td className={styles.specVal}>{product.brand}</td>
                </tr>
              )}
              {category && (
                <tr>
                  <td className={styles.specKey}>Category</td>
                  <td className={styles.specVal}>{category.name}</td>
                </tr>
              )}
              {activeVariants.length > 0 && (
                <tr>
                  <td className={styles.specKey}>Available Sizes</td>
                  <td className={styles.specVal}>
                    {[...new Set(activeVariants.map((v: any) => v.size).filter(Boolean))].join(", ") || "—"}
                  </td>
                </tr>
              )}
              {activeVariants.length > 0 && (
                <tr>
                  <td className={styles.specKey}>Available Colors</td>
                  <td className={styles.specVal}>
                    {[...new Set(activeVariants.map((v: any) => v.color).filter(Boolean))].join(", ") || "—"}
                  </td>
                </tr>
              )}
              <tr>
                <td className={styles.specKey}>SKU</td>
                <td className={styles.specVal}>
                  {activeVariants[0]?.sku ?? "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Reviews */}
        <section className={styles.reviewsSection}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.sectionHeading}>Customer Reviews</h2>
            {reviewList.length > 0 && (
              <div className={styles.ratingOverview}>
                <span className={styles.bigRating}>{avgRating.toFixed(1)}</span>
                <div>
                  <StarRow rating={avgRating} size={20} />
                  <p className={styles.reviewTotal}>{reviewList.length} review{reviewList.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
          </div>

          {reviewList.length === 0 ? (
            <div className={styles.noReviews}>
              <NoReviewIcon />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className={styles.reviewsList}>
              {reviewList.map((review: any) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div className={styles.reviewerAvatar}>
                      {(review.profiles?.full_name ?? "U")[0].toUpperCase()}
                    </div>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>
                        {review.profiles?.full_name ?? "Anonymous"}
                      </span>
                      {review.verified_purchase && (
                        <span className={styles.verifiedBadge}>
                          <CheckIcon /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <StarRow rating={review.rating} size={14} />
                  {review.comment && (
                    <p className={styles.reviewComment}>{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ── Star Row (server-safe) ── */
function StarRow({ rating, size }: { rating: number; size: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i + 0.5 <= rating;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`sg_${size}_${i}`}>
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={filled ? "#f59e0b" : half ? `url(#sg_${size}_${i})` : "#d1d5db"}
              stroke="none"
            />
          </svg>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function NoReviewIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
