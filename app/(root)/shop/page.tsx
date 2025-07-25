"use client";
import { ProductCard } from "@/components/product-card";
import { useAppSelector } from "@/hooks/useRedux";
import { useSearchParams } from "next/navigation";
import React from "react";

const ShopPage = () => {
  const { products } = useAppSelector((state) => state.product);
  const searchParams = useSearchParams();
  console.log({});
  const search = searchParams.get("q") || "";

  const filtersProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.includes(search);

    return matchesSearch;
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          {/* <h2 className="text-3xl font-bold">{category.name}</h2>
          <Link href={`/category/${category.slug}`}>
            <Button variant="outline">See All</Button>
          </Link> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtersProducts.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopPage;
