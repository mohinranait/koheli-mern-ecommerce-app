import { ICategory } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  category: ICategory;
};
const CategoryCard = ({ category }: Props) => {
  return (
    <div key={category._id} className="group cursor-pointer">
      <Link href={`/category/${category.slug}`}>
        <div className="relative h-32 md:h-40 rounded-lg overflow-hidden mb-4">
          <Image
            src={category?.image || "/placeholder.svg"}
            alt={category?.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-white text-lg font-bold">{category.name}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
