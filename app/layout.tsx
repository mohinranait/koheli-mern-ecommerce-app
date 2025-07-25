import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/providers/ReduxProvider";
import { BASE_URL } from "@/lib/accessEnv";
import { ICategory, IProduct } from "@/types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopBD - Your Online Shopping Destination",
  description:
    "Shop furniture, electronics, and fashion at the best prices in Bangladesh",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // GET PRODUCTS
  const productRes = await fetch(`${BASE_URL}/api/products`, {
    method: "GET",
    cache: "no-store",
  });
  const productsData = await productRes.json();
  const products: IProduct[] = productsData?.data;

  // GET CATEGORYS
  const catResponse = await fetch(`${BASE_URL}/api/categories`);
  const categoriesData = await catResponse.json();
  const categories: ICategory[] = categoriesData?.data || [];

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider products={products} categories={categories}>
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
