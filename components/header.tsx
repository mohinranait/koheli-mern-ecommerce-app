"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ICategory } from "@/types";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality here
      console.log("Searching for:", searchQuery);
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const params = new URLSearchParams();

      const response = await fetch(`/api/categories?${params}`);
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ShopBD</span>
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center space-x-8 flex-1 max-w-2xl mx-8">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              {categories?.slice(0, 3)?.map((cat) => (
                <Link
                  key={cat?._id}
                  href={`/category/${cat?.slug}`}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {cat?.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
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
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-blue-600"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link
                    href="/"
                    className="text-lg font-medium text-gray-900 hover:text-blue-600"
                  >
                    Home
                  </Link>
                  {categories?.map((cat) => (
                    <Link
                      key={cat?._id}
                      href={`/category/${cat?.slug}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {cat?.name}
                    </Link>
                  ))}

                  <div className="border-t pt-6">
                    <Link
                      href="/login"
                      className="flex items-center text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      <User className="h-5 w-5 mr-3" />
                      Login
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

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
