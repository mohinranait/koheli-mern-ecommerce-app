"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { User, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppSelector } from "@/hooks/useRedux";
import { ICategory } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "./logo";
import { CategoriesNavbar } from "./CategoriesNavbar";

export function Header() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { categories } = useAppSelector((state) => state.category);
  const { products } = useAppSelector((state) => state.product);
  const router = useRouter();

  const activeCategories = categories?.filter(
    (cat) => cat?.status === "active"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?q=${searchQuery}`);
  };

  const getCategories = (categories: ICategory[]) => {
    return categories?.filter((cat) =>
      products?.some((prod) => prod?.category === cat?._id)
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center space-x-8 flex-1 max-w-2xl mx-8">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="flex-1 ">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>

            {/* Login Button */}
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-blue-600"
              >
                <User className="h-4 w-4 mr-2" />

                <span className="hidden sm:inline">
                  {isAuthenticated ? "Dashboard" : "Login"}
                </span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] pt-0 bp-3 px-0 ">
                <div className="border-b">
                  <p className="py-3 font-semibold px-3">Categories</p>
                </div>
                <div className=" flex flex-col space-y-3 overflow-auto max-h-[calc(100vh-110px)]">
                  <Link
                    href="/"
                    className="text-lg font-medium px-3 text-gray-900 hover:text-blue-600"
                  >
                    Home
                  </Link>
                  {getCategories(activeCategories)?.map((cat) => (
                    <Link
                      key={cat?._id}
                      href={`/category/${cat?.slug}`}
                      className="text-lg font-medium flex items-center gap-2 px-3 text-gray-900 hover:text-blue-600"
                    >
                      <Image
                        src={cat?.image || "/placeholder.webp"}
                        width={20}
                        height={20}
                        alt="Categories"
                        className="w-5 h-5 rounded-full"
                      />{" "}
                      {cat?.name}
                    </Link>
                  ))}
                </div>

                <div className="border-t px-3 py-4 pb-10 ">
                  <Link
                    href="/login"
                    className="flex items-center pb-3 text-lg font-medium text-gray-900 hover:text-blue-600"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Login
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <CategoriesNavbar />

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 pt-2 border-t">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
