import type React from "react";

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { notFound } from "next/navigation";
import OrderFrom from "@/components/forms/order-from";
import { BASE_URL } from "@/lib/accessEnv";
import { IProduct } from "@/types";

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Details */}
        <div>
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
            ৳{product.price.toLocaleString()}
          </p>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        {/* Order Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Place Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderFrom product={product} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
