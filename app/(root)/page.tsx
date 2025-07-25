import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ICategory, IProduct } from "@/types";
import { BASE_URL } from "@/lib/accessEnv";

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
      {/* <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
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
      </section> */}

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories?.map((category) => (
              <div key={category._id} className="group cursor-pointer">
                <Link href={`/category/${category.slug}`}>
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products by Category */}
      {categories.map((category) => {
        const categoryProducts = products
          .filter((p) => p.category === category._id)
          .slice(0, 3);

        return (
          categoryProducts?.length > 0 && (
            <section key={category._id} className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">{category.name}</h2>
                  <Link href={`/category/${category.slug}`}>
                    <Button variant="outline">See All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )
        );
      })}
    </div>
  );
}
