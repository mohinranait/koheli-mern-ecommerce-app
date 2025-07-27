import CategorySection from "@/components/pages/home/category-section";

import AllProducts from "@/components/pages/home/all-products";
import MarqueText from "@/components/marque-text";

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <MarqueText />

      {/* Categories Section */}
      <CategorySection />

      <AllProducts />

      {/* Featured Products by Category */}
      {/* <CategorysSection /> */}
    </div>
  );
}
