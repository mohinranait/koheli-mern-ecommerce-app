"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { useAppSelector } from "@/hooks/useRedux";
import { ICategory } from "@/types";

export function Footer() {
  const { categories } = useAppSelector((state) => state.category);
  const { products } = useAppSelector((state) => state.product);
  const pathName = usePathname();
  const getCategories = (categories: ICategory[]) => {
    return categories?.filter((cat) =>
      products?.some((prod) => prod?.category === cat?._id)
    );
  };

  if (pathName == "/") {
    return null;
  }
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link href={"/"} className="text-xl font-bold text-gray-100">
                koheli.com
              </Link>
            </div>
            <p className="text-gray-400">
              Your trusted online shopping destination in Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              {getCategories(categories)
                ?.slice(0, 3)
                ?.map((cat) => {
                  const foundProducts = products?.find(
                    (prod) => prod?.category === cat?._id
                  );
                  return (
                    foundProducts && (
                      <li key={cat?._id}>
                        <Link
                          href={`/category/${cat?.slug}`}
                          className="hover:text-white transition-colors"
                        >
                          {cat?.name}
                        </Link>
                      </li>
                    )
                  );
                })}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                Helpline: <Link href={"tel:01739825295"}>01739825295</Link>
              </li>
              <li>
                WhatsApp:{" "}
                <Link href={"https://wa.me/+8801739825295"}>01739825295</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024{" "}
            <span className="text-xl font-bold text-gray-100">koheli.com</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
