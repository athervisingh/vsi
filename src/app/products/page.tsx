import { createServerClient } from "@/lib/supabase-server";
import ProductGrid from "@/components/shared/productGrid/ProductGrid";
import Link from "next/link";
import type { Product } from "@/components/shared/productGrid/ProductGrid";
import styles from "./products.module.css";

type CategoryWithProducts = {
  id: string;
  name: string;
  slug: string;
  products: Product[];
};

async function getAllCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const supabase = await createServerClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (!categories?.length) return [];

  const result = await Promise.all(
    categories.map(async (cat) => {
      const { data: products } = await supabase
        .from("products")
        .select(`
          id, name, slug, base_price, brand,
          product_images(url, is_primary, sort_order)
        `)
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        products: (products ?? []).map((p: any): Product => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: cat.name,
          image:
            p.product_images?.find((img: any) => img.is_primary)?.url ||
            p.product_images?.[0]?.url ||
            "/placeholder.png",
          price: Math.round(p.base_price),
          originalPrice: Math.round(p.base_price * 1.2),
          rating: 4.5,
          reviews: 120,
          badge: "New",
          badgeColor: "blue" as const,
        })),
      };
    })
  );

  return result.filter((cat) => cat.products.length > 0);
}

export default async function ProductsPage() {
  const categories = await getAllCategoriesWithProducts();

  const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0);

  return (
    <main className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>All Products</span>
        </div>
        <h1 className={styles.pageTitle}>All Products</h1>
        <p className={styles.pageSubtitle}>
          {totalProducts} products across {categories.length} categories
        </p>
      </div>

      {/* ── Category Tabs / Pills ── */}
      {categories.length > 0 && (
        <div className={styles.categoryNav}>
          <a href="#all" className={`${styles.categoryPill} ${styles.categoryPillActive}`}>
            All
          </a>
          {categories.map((cat) => (
            <a key={cat.id} href={`#${cat.slug}`} className={styles.categoryPill}>
              {cat.name}
            </a>
          ))}
        </div>
      )}

      {/* ── Products by Category ── */}
      {categories.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Abhi koi products available nahi hain.</p>
          <Link href="/" className={styles.homeLink}>Back to Home</Link>
        </div>
      ) : (
        <div id="all">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.slug} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div>
                  <h2 className={styles.categoryTitle}>{cat.name}</h2>
                  <p className={styles.categoryCount}>{cat.products.length} products</p>
                </div>
                <Link href={`/categories/${cat.slug}`} className={styles.viewAllLink}>
                  View All {cat.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
              <ProductGrid
                title=""
                products={cat.products}
                compact
              />
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
