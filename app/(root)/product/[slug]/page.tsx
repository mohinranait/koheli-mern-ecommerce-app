import type React from "react";

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { notFound } from "next/navigation";
import OrderFrom from "@/components/forms/order-from";
import { BASE_URL } from "@/lib/accessEnv";
import { IProduct } from "@/types";
import { Minus, Plus } from "lucide-react";
import CategoryName from "@/components/pages/product/category-name";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productRes = await fetch(`${BASE_URL}/api/products`, {
    method: "GET",
    cache: "no-store",
  });
  const productsData = await productRes.json();
  const products: IProduct[] = productsData?.data;

  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-2 md:pt-6">
      <div className="flex gap-5  md:hidden p-4">
        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center relative mb-6">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-[140px] rounded-lg"
            width={140}
            height={140}
          />
        </div>

        <div className="flex-1">
          <p className="text-base font-semibold mb-1 ">{product.name}</p>
          {product?.category && <CategoryName catId={product?.category} />}
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">
              {" "}
              ৳{product.price.toFixed(2)}
            </span>
            <div className="flex gap-1 items-center">
              <span className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Minus size={15} />
              </span>
              <span className="w-5 h-5 flex items-center justify-center text-xl">
                1
              </span>
              <span className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Plus size={15} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}

        <div>
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              {/* Delivery Notice */}
              <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-6 rounded-lg mb-4 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">ডেলিভারি তথ্য</h3>
                </div>
                <p className="text-green-50 leading-relaxed">
                  ডেলিভারিন চার্জ ৫০ টাকা তবে অবস্থান ও প্রোডাক্ট এর ওজন
                  অনুযায়ী ডেলিভারি চার্জ পরিবর্তিত হতে পারে
                </p>
              </div>

              {/* Order Instructions */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">অর্ডার প্রক্রিয়া</h3>
                </div>
                <p className="text-green-50 leading-relaxed">
                  অর্ডার কনফার্ম করতে আপনার নাম, নাম্বার, ঠিকানা দিয়ে কনফার্ম
                  করুন
                </p>
              </div>
            </CardHeader>

            <CardHeader className="pt-2">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Place Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderFrom product={product} />
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="hidden md:block">
          <div className="aspect-square relative mb-6">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            ৳{product.price.toFixed(2)}
          </p>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
