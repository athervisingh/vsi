import { createServerClient } from "@/lib/supabase-server";
import ProductGrid from "@/components/shared/productGrid/ProductGrid";
import Link from "next/link";
import type { Product } from "@/components/shared/productGrid/ProductGrid";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerClient();

  // Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!category) {
    return (
      <main style={{ padding: "80px 24px", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, marginBottom: 16 }}>
          Category Not Found
        </h1>
        <p style={{ fontSize: 16, color: "#888", marginBottom: 32 }}>
          The category you're looking for doesn't exist.
        </p>
        <Link href="/" style={{ padding: "12px 24px", background: "var(--accent, #f97316)", color: "#fff", textDecoration: "none", borderRadius: 6, fontWeight: 700 }}>
          Back to Home
        </Link>
      </main>
    );
  }

  // Fetch products for this category
  const { data: productsData } = await supabase
    .from("products")
    .select(`
      id, name, slug, base_price, brand, description,
      product_images(url, is_primary, sort_order)
    `)
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Transform products to match ProductGrid type
  const products: Product[] = (productsData ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: category.name,
    image: p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url || "/placeholder.png",
    price: Math.round(p.base_price),
    originalPrice: Math.round(p.base_price * 1.2),
    rating: 4.5,
    reviews: 120,
    badge: "New",
    badgeColor: "blue" as const,
  }));

  return (
    <main style={{ background: "var(--bg-primary)" }}>
      {/* Breadcrumb & Header */}
      <div style={{ padding: "60px 24px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--accent, #f97316)", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Home
        </Link>
        <h1 style={{
          marginTop: 20,
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900,
          textTransform: "uppercase",
          color: "var(--section-heading)",
          letterSpacing: "-0.5px",
          margin: "20px 0 8px 0"
        }}>
          {category.name}
        </h1>
        <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <ProductGrid
          title={`All ${category.name} Products`}
          products={products}
        />
      ) : (
        <div style={{
          padding: "80px 24px",
          textAlign: "center",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 1400,
          margin: "0 auto"
        }}>
          <p style={{ fontSize: 16, color: "#888", marginBottom: 24 }}>
            No products available in this category yet.
          </p>
          <p style={{ fontSize: 14, color: "#666" }}>
            Check back soon for new items!
          </p>
        </div>
      )}
    </main>
  );
}
