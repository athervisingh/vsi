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

const newArrivals: Product[] = [
  { id: 1, name: "Pro English Willow Bat", category: "Cricket", image: "/bat.png", price: 2499, originalPrice: 2999, rating: 4.8, reviews: 124, badge: "New", badgeColor: "blue", slug: "pro-english-willow-bat" },
  { id: 2, name: "FIFA Match Football", category: "Football", image: "/football.png", price: 1299, originalPrice: 1599, rating: 4.6, reviews: 89, badge: "Best Seller", badgeColor: "orange", slug: "fifa-match-football" },
  { id: 3, name: "Pro Skateboard Deck", category: "Skating", image: "/skate.png", price: 3499, originalPrice: 4299, rating: 4.7, reviews: 67, badge: "Trending", badgeColor: "green", slug: "pro-skateboard-deck" },
  { id: 4, name: "Tournament Cricket Ball", category: "Cricket", image: "/bat.png", price: 599, originalPrice: 799, rating: 4.5, reviews: 201, badge: undefined, badgeColor: undefined, slug: "tournament-cricket-ball" },
];

const bestSellers: Product[] = [
  { id: 5, name: "Hockey Stick Pro", category: "Hockey", image: "/hockey.png", price: 1899, originalPrice: 2299, rating: 4.9, reviews: 312, badge: "Hot", badgeColor: "red", slug: "hockey-stick-pro" },
  { id: 6, name: "Size 5 Football", category: "Football", image: "/football.png", price: 899, originalPrice: 1099, rating: 4.4, reviews: 178, badge: undefined, badgeColor: undefined, slug: "size-5-football" },
  { id: 7, name: "Willow Bat Lite", category: "Cricket", image: "/bat.png", price: 1299, originalPrice: 1499, rating: 4.3, reviews: 95, badge: "Sale", badgeColor: "orange", slug: "willow-bat-lite" },
  { id: 8, name: "Street Skate Deck", category: "Skating", image: "/skate.png", price: 2199, originalPrice: 2799, rating: 4.6, reviews: 54, badge: undefined, badgeColor: undefined, slug: "street-skate-deck" },
];

type Props = {
  categories: Category[];
  categoryProducts?: CategoryWithProducts[];
};

export default function HomePage({ categories, categoryProducts }: Props) {
  return (
    <main>
      <Hero />
      <TopThree />
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
      <ProductGrid
        eyebrow="Just In"
        title="New Arrivals"
        viewAllLink="/products?sort=newest"
        products={newArrivals}
      />
      <ProductGrid
        eyebrow="Top Picks"
        title="Best Sellers"
        viewAllLink="/products?sort=bestsellers"
        products={bestSellers}
      />

      {/* ── Category Products with Alternating Layout ── */}
      {categoryProducts && categoryProducts.length > 0 && (
        <CategoryProductsSection categoryProducts={categoryProducts} />
      )}
    </main>
  );
}
