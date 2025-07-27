"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

export function Footer() {
  const pathName = usePathname();
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
              <li>
                <Link
                  href="/category/furniture"
                  className="hover:text-white transition-colors"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  href="/category/electronics"
                  className="hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fashion"
                  className="hover:text-white transition-colors"
                >
                  Fashion
                </Link>
              </li>
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
