"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  BookOpen,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/useRedux";
import { ICategory } from "@/types";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parent: string | null;
  level: number;
  courseCount: number;
  children: Category[];
}

interface CategoriesNavbarProps {
  className?: string;
}

export function CategoriesNavbar({ className = "" }: CategoriesNavbarProps) {
  const { categories } = useAppSelector((state) => state.category);
  const { products } = useAppSelector((state) => state.product);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeCategories = categories?.filter(
    (cat) => cat?.status === "active"
  );

  useEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
        clearTimeout(timer);
      };
    }
  }, [categories]);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const getCategories = (categories: ICategory[]) => {
    return categories?.filter((cat) =>
      products?.some((prod) => prod?.category === cat?._id)
    );
  };

  return (
    <div className={` border-border/40 border-b hidden md:block ${className}`}>
      <div className="my-container">
        <div className="relative flex max-h-12 items-center pb-2">
          {/* Left Scroll Arrow */}
          <Button
            variant="ghost"
            size="sm"
            className={`bg-background/90 absolute left-0 z-10 h-8 w-8 border p-0 shadow-md backdrop-blur-sm transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4 stroke-pure-white" />
          </Button>

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="scrollbar-none flex items-center justify-between overflow-x-auto scroll-smooth lg:space-x-5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              minWidth: "0",
              flex: "1",
            }}
          >
            {getCategories(activeCategories)?.map((category) => (
              <div key={category._id} className="relative flex-shrink-0 ">
                <Link
                  href={`/category/${category.slug}`}
                  className="text-foreground/80 hover:text-primary  group flex items-center space-x-2 text-sm group font-medium whitespace-nowrap transition-colors relative group"
                >
                  <div className="flex items-center transition duration-75 gap-2 rounded w-auto  px-3 py-1 ">
                    {/* <Image
                      src={category?.image || "/placeholder.webp"}
                      width={20}
                      height={20}
                      alt="Category"
                      className="w-4 h-4 rounded"
                    /> */}
                    <span>{category.name}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Scroll Arrow */}
          <Button
            variant="ghost"
            size="sm"
            className={`bg-background/90 absolute right-0 z-10 h-8 w-8 border p-0 shadow-md backdrop-blur-sm transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4 stroke-pure-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
