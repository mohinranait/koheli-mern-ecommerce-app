"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare } from "lucide-react";
import { orders } from "@/lib/data";

export default function DashboardPage() {
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState(orders);
  const router = useRouter();

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    if (!phone) {
      router.push("/login");
    } else {
      setUserPhone(phone);
    }
  }, [router]);

  if (!userPhone) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {userOrders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{order.productName}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Order ID: {order._id}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Date: {order.createdAt}
                    </p>
                    <p className="text-lg font-bold text-primary mb-3">
                      ৳{order.price.toLocaleString()}
                    </p>

                    {/* Admin Message Display */}
                    {order.adminMessage && (
                      <Alert className="bg-blue-50 border-blue-200">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Message from Admin:</strong>{" "}
                          {order.adminMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
