import HomePage from "@/pages/HomePage";
import { createServerClient } from "@/lib/supabase-server";
import type { Category } from "@/types";
import type { CategoryWithProducts } from "@/components/homepagecomponents/categoryProductsSection/CategoryProductsSection";
import type { Product } from "@/components/shared/productGrid/ProductGrid";

async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id, parent_id, name, slug, image_url, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return data ?? [];
}

async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const supabase = createServerClient();

  // Get all active categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (!categories?.length) return [];

  // Fetch products for each category
  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const { data: products } = await supabase
        .from("products")
        .select(`
          id, name, slug, base_price, brand, description,
          product_images(url, is_primary, sort_order)
        `)
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);

      return {
        ...cat,
        products: (products ?? []).map((p: any): Product => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: cat.name,
          image: p.product_images?.[0]?.url || "/placeholder.png",
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

  // Filter out categories with no products
  return categoriesWithProducts.filter((cat) => cat.products.length > 0);
}

export default async function Page() {
  const [categories, categoryProducts] = await Promise.all([
    getCategories(),
    getCategoriesWithProducts(),
  ]);

  return <HomePage categories={categories} categoryProducts={categoryProducts} />;
}
