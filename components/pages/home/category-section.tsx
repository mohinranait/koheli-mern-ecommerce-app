"use client";
import { useAppSelector } from "@/hooks/useRedux";
import { ICategory } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CategoryCard from "../category/category-card";
import { Button } from "@/components/ui/button";

const CategorySection = () => {
  const { categories } = useAppSelector((state) => state.category);
  const { products } = useAppSelector((state) => state.product);

  const getCategories = (categories: ICategory[]) => {
    return categories?.filter((cat) =>
      products?.some((prod) => prod?.category === cat?._id)
    );
  };

  return (
    <section className="py-5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3  sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-2 xl:gap-5">
          {getCategories(categories)?.map((category) => {
            return <CategoryCard key={category?._id} category={category} />;
          })}
        </div>
        <div className="flex justify-center">
          <Link href={"/category"}>
            <Button className="" type="button">
              See all category
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
