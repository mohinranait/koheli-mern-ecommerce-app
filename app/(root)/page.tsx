import { Button } from "@/components/ui/button";

import CategorySection from "@/components/pages/home/category-section";
import CategorysSection from "@/components/pages/home/categorys-section";
import Marquee from "react-fast-marquee";

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Marquee Designs */}
      <div className="h-8 text-white flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <Marquee>
          I can be a React component, multiple React components, or just some
          text.
        </Marquee>
      </div>

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Products by Category */}
      <CategorysSection />
    </div>
  );
}
