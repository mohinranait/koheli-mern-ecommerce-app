"use client";
import { useAppSelector } from "@/hooks/useRedux";
import { ICategory } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategorySection = () => {
  const { categories } = useAppSelector((state) => state.category);
  const { products } = useAppSelector((state) => state.product);

  const getCategories = (categories: ICategory[]) => {
    return categories?.filter((cat) =>
      products?.some((prod) => prod?.category === cat?._id)
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3  sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-2 xl:gap-5">
          {getCategories(categories)?.map((category) => {
            const counts = products?.filter(
              (prod) => prod?.category === category?._id
            )?.length;
            return (
              <div key={category._id} className="group cursor-pointer">
                <Link href={`/category/${category.slug}`}>
                  <div className="relative h-32 md:h-40 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h3 className="text-white text-lg font-bold">
                        {category.name}
                      </h3>
                      <h3 className="text-white text-sm ">{counts} items</h3>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
