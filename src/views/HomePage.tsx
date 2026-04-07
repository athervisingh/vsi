import Hero from "@/components/homepagecomponents/hero/Hero";
import TopThree from "@/components/homepagecomponents/topThree/TopThree";
import CategoryGrid from "@/components/shared/categoryGrid/CategoryGrid";
import OffersSection from "@/components/shared/offersSection/OffersSection";
import ProductGrid from "@/components/shared/productGrid/ProductGrid";
import CategoryProductsSection from "@/components/homepagecomponents/categoryProductsSection/CategoryProductsSection";
import type { Offer } from "@/components/shared/offersSection/OffersSection";
import type { Product } from "@/components/shared/productGrid/ProductGrid";
import type { Category } from "@/types";
import type { CategoryWithProducts } from "@/components/homepagecomponents/categoryProductsSection/CategoryProductsSection";
import type { FeaturedProduct } from "@/components/homepagecomponents/topThree/TopThree";

const homeOffers: Offer[] = [
  {
    id: 1,
    tag: "Flash Sale",
    discount: "30%",
    discountSuffix: "OFF",
    heading: "Cricket Gear",
    description: "On all bats, pads & gloves. Limited stock — grab yours today.",
    image: "/bat.png",
    ctaText: "Shop Cricket",
    ctaLink: "/categories/cricket",
    color: "orange",
  },
  {
    id: 2,
    tag: "Weekend Deal",
    discount: "₹500",
    discountSuffix: "OFF",
    heading: "Football Range",
    description: "On purchase above ₹2,499. Match balls & boots included.",
    image: "/football.png",
    ctaText: "Shop Football",
    ctaLink: "/categories/football",
    color: "blue",
  },
  {
    id: 3,
    tag: "New Arrival",
    discount: "20%",
    discountSuffix: "OFF",
    heading: "Skate Collection",
    description: "Pro-grade boards & safety gear at unbeatable prices.",
    image: "/skate.png",
    ctaText: "Shop Skating",
    ctaLink: "/categories/skating",
    color: "green",
  },
];


type Props = {
  categories: Category[];
  featuredProducts: FeaturedProduct[];
  newArrivals: Product[];
  bestSellers: Product[];
  categoryProducts?: CategoryWithProducts[];
};

export default function HomePage({ categories, featuredProducts, newArrivals, bestSellers, categoryProducts }: Props) {
  return (
    <main>
      <Hero />
      <TopThree products={featuredProducts} />
      <CategoryGrid
        eyebrow="Explore"
        title="Shop By Sport"
        categories={categories}
      />
      <OffersSection
        eyebrow="Limited Time"
        title="Exclusive Deals"
        offers={homeOffers}
      />
      {newArrivals.length > 0 && (
        <ProductGrid
          eyebrow="Just In"
          title="New Arrivals"
          viewAllLink="/products"
          products={newArrivals}
        />
      )}
      {bestSellers.length > 0 && (
        <ProductGrid
          eyebrow="Top Picks"
          title="Best Sellers"
          viewAllLink="/products"
          products={bestSellers}
        />
      )}

      {/* ── Category Products with Alternating Layout ── */}
      {categoryProducts && categoryProducts.length > 0 && (
        <CategoryProductsSection categoryProducts={categoryProducts} />
      )}
    </main>
  );
}
