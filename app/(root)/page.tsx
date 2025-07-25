import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ICategory, IProduct } from "@/types";
import { BASE_URL } from "@/lib/accessEnv";
import CategorySection from "@/components/pages/home/category-section";
import CategorysSection from "@/components/pages/home/categorys-section";

export default async function HomePage() {
  const productRes = await fetch(`${BASE_URL}/api/products`, {
    method: "GET",
    cache: "no-store",
  });
  const productsData = await productRes.json();
  const products: IProduct[] = productsData?.data;

  const catResponse = await fetch(`${BASE_URL}/api/categories`);
  const categoriesData = await catResponse.json();
  const categories: ICategory[] = categoriesData?.data || [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to ShopBD
            </h1>
            <p className="text-xl mb-8">
              Discover amazing products at unbeatable prices. Shop furniture,
              electronics, and fashion all in one place.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Products by Category */}
      <CategorysSection />
    </div>
  );
}
