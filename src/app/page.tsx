import HomePage from "@/pages/HomePage";
import { createServerClient } from "@/lib/supabase-server";
import type { Category } from "@/types";
import type { CategoryWithProducts } from "@/components/homepagecomponents/categoryProductsSection/CategoryProductsSection";
import type { Product } from "@/components/shared/productGrid/ProductGrid";
import type { FeaturedProduct } from "@/components/homepagecomponents/topThree/TopThree";

async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id, parent_id, name, slug, image_url, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return data ?? [];
}

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("products")
    .select(`
      id, name, slug, description, base_price, brand,
      categories(name),
      product_images(url, is_primary, sort_order),
      product_variants(id, is_active)
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (data ?? []).map((p: any): FeaturedProduct => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    base_price: Math.round(p.base_price),
    brand: p.brand,
    category_name: p.categories?.name ?? "Sports",
    image:
      p.product_images?.find((img: any) => img.is_primary)?.url ||
      p.product_images?.[0]?.url ||
      "/placeholder.png",
    default_variant_id: p.product_variants?.find((v: any) => v.is_active)?.id,
  }));
}

async function getNewArrivals(): Promise<Product[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("products")
    .select(`
      id, name, slug, base_price, brand,
      categories(name),
      product_images(url, is_primary, sort_order),
      product_variants(id, is_active)
    `)
    .eq("is_active", true)
    .eq("is_new_arrival", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (data ?? []).map((p: any): Product => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categories?.name ?? "Sports",
    image:
      p.product_images?.find((img: any) => img.is_primary)?.url ||
      p.product_images?.[0]?.url ||
      "/placeholder.png",
    price: Math.round(p.base_price),
    originalPrice: Math.round(p.base_price * 1.25),
    rating: 4.5,
    reviews: 0,
    badge: "New",
    badgeColor: "blue" as const,
    default_variant_id: p.product_variants?.find((v: any) => v.is_active)?.id,
  }));
}

async function getBestSellers(): Promise<Product[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("products")
    .select(`
      id, name, slug, base_price, brand,
      categories(name),
      product_images(url, is_primary, sort_order),
      product_variants(id, is_active)
    `)
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (data ?? []).map((p: any): Product => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categories?.name ?? "Sports",
    image:
      p.product_images?.find((img: any) => img.is_primary)?.url ||
      p.product_images?.[0]?.url ||
      "/placeholder.png",
    price: Math.round(p.base_price),
    originalPrice: Math.round(p.base_price * 1.25),
    rating: 4.8,
    reviews: 0,
    badge: "Hot",
    badgeColor: "red" as const,
    default_variant_id: p.product_variants?.find((v: any) => v.is_active)?.id,
  }));
}

async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const supabase = await createServerClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (!categories?.length) return [];

  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const { data: products } = await supabase
        .from("products")
        .select(`
          id, name, slug, base_price, brand, description,
          product_images(url, is_primary, sort_order),
          product_variants(id, is_active)
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
          default_variant_id: p.product_variants?.find((v: any) => v.is_active)?.id,
        })),
      };
    })
  );

  return categoriesWithProducts.filter((cat) => cat.products.length > 0);
}

export default async function Page() {
  const [categories, featuredProducts, newArrivals, bestSellers, categoryProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
    getCategoriesWithProducts(),
  ]);

  return (
    <HomePage
      categories={categories}
      featuredProducts={featuredProducts}
      newArrivals={newArrivals}
      bestSellers={bestSellers}
      categoryProducts={categoryProducts}
    />
  );
}
