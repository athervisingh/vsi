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
    discount: "20%",
    discountSuffix: "OFF",
    heading: "Cricket Gear",
    subheading: "Bats • Pads • Gloves • Helmets",
    description: "Top-quality cricket equipment at unbeatable prices. Limited stock — order now.",
    image: "/bat.png",
    ctaText: "Shop Cricket",
    ctaLink: "/categories/cricket",
    couponCode: "CRICKET20",
    color: "orange",
  },
  {
    id: 2,
    tag: "Ball Bonanza",
    discount: "15%",
    discountSuffix: "OFF",
    heading: "Sports Balls",
    subheading: "Cricket • Football • Volleyball",
    description: "Pro-grade match balls for every sport. Durable, official-weight, tournament-ready.",
    image: "/football.png",
    ctaText: "Shop Balls",
    ctaLink: "/categories/balls",
    couponCode: "BALL15",
    color: "blue",
  },
  {
    id: 3,
    tag: "Footwear Fest",
    discount: "25%",
    discountSuffix: "OFF",
    heading: "Sports Shoes",
    subheading: "Running • Court • Outdoor",
    description: "Performance footwear engineered for every terrain and sport. Grip, comfort, speed.",
    image: "/shoes.png",
    ctaText: "Shop Shoes",
    ctaLink: "/categories/shoes",
    couponCode: "SHOES25",
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
