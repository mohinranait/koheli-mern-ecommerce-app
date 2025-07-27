import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        {product?.link && (
          <Link
            href={`${product?.link}`}
            target="_blank"
            className="text-blue-600 text-base mb-2 "
          >
            View Details
          </Link>
        )}
        <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-primary">
          ৳{product.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.slug}`} className="w-full">
          <Button className="w-full">Buy Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
