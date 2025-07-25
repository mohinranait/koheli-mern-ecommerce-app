"use client";
import { useAppSelector } from "@/hooks/useRedux";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategorySection = () => {
  const { categories } = useAppSelector((state) => state.category);
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
  );
};

export default CategorySection;
