"use client";
import CategoryCard from "@/components/pages/category/category-card";
import { useAppSelector } from "@/hooks/useRedux";
import React from "react";

const AllCategories = () => {
  const { categories } = useAppSelector((state) => state.category);
  const activeCategories = categories?.filter((cat) => cat.status === "active");
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold ">All Categories</h1>
        <p className="text-gray-600">
          Showing {activeCategories?.length} categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeCategories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default AllCategories;
