import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  const { data: products } = await supabase
    .from("products")
    .select(`
      id, name, slug, base_price, brand,
      product_images(url, is_primary)
    `)
    .eq("category_id", category?.id ?? "")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <Link href="/" style={{ fontSize: 13, color: "var(--accent, #f97316)", textDecoration: "none" }}>
        ← Back to Home
      </Link>
      <h1 style={{ marginTop: 16, fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, textTransform: "uppercase" }}>
        {category?.name ?? slug}
      </h1>
      {!products?.length ? (
        <p style={{ marginTop: 32, color: "#888" }}>No products yet. Check back soon.</p>
      ) : (
        <p style={{ marginTop: 8, color: "#888" }}>{products.length} product{products.length !== 1 ? "s" : ""}</p>
      )}
    </main>
  );
}
