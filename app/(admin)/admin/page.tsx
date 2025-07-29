"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Tags, TrendingUp } from "lucide-react";
import { orders, categories } from "@/lib/data";
import { useAppSelector } from "@/hooks/useRedux";
import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import { toast } from "sonner";
import { current } from "@reduxjs/toolkit";

export default function AdminDashboard() {
  const { products } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCategories = categories.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);

  const revinews =
    allOrders
      ?.filter((order) => order?.status === "delivered")
      ?.reduce((total, cur) => (total += cur?.price), 0) || 0;
  console.log({ revinews });

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      setAllOrders(data.data as IOrder[]);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: allOrders?.length,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Tags,
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: `৳${revinews?.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{order.productName}</p>
                    <p className="text-sm text-gray-500">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ৳{order.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product?._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{product?.name}</p>
                    <p className="text-sm text-gray-500">
                      {
                        categories?.find(
                          (cat) => cat?._id === product?.category
                        )?.name
                      }
                    </p>
                  </div>
                  <p className="font-medium">৳{product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
