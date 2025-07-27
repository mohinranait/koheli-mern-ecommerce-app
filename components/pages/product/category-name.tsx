"use client";
import { useAppSelector } from "@/hooks/useRedux";

import React from "react";

const CategoryName = ({ catId }: { catId: string }) => {
  const { categories } = useAppSelector((state) => state.category);
  const findCat = categories?.find((cat) => cat?._id === catId);
  if (!findCat) {
    return;
  }
  return (
    <p className="text-sm font-semibold text-gray-600 mb-2 sm:text-xl">
      Category: {findCat.name}
    </p>
  );
};

export default CategoryName;
