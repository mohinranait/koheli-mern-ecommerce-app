"use client";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useRedux";
import Link from "next/link";
import React from "react";

const CategorysSection = () => {
  const { categories } = useAppSelector((state) => state.category);
  const { products } = useAppSelector((state) => state.product);

  return (
    <>
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
    </>
  );
};

export default CategorysSection;
