"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare } from "lucide-react";

import moment from "moment";
import { Button } from "@/components/ui/button";
import withAuth from "@/hoc/withAuth";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logoutUser } from "@/redux/features/authSlice";
import Image from "next/image";
import { IOrder } from "@/types";
import InfoBar from "@/components/Info-bar";

function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [userOrders, setUserOrders] = useState<IOrder[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const dispatch = useAppDispatch();

  const fetchOrders = async (phoneNumber: string) => {
    try {
      setOrderLoading(true);
      const res = await fetch(`/api/orders?phone=${phoneNumber}`);
      const resData = await res.json();

      if (resData?.success) {
        setUserOrders(resData?.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (user?.phone) {
      fetchOrders(user.phone);
    }
  }, [user]);

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
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Phone: {user?.phone}</p>
        </div>
        <div>
          <Button
            variant={"destructive"}
            onClick={() => {
              dispatch(logoutUser());
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid space-y-5 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orderLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order, index) => (
                  <div className="flex flex-col md:flex-row w-full border gap-4  rounded-lg p-4">
                    <div>
                      <Image
                        src={order?.productImg || "/placeholder.webp"}
                        alt="image"
                        width={200}
                        height={200}
                        className="rounded w-[100px]  "
                      />
                    </div>
                    <div key={order._id || index} className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{order.productName}</h3>
                        <Badge
                          className={`capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Order ID: {order._id}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Date:{" "}
                        {moment(order.createdAt).format("MMM dd, YYYY hh:mm A")}
                      </p>
                      <p className="text-lg font-bold text-primary mb-3">
                        ৳{order.price?.toLocaleString() || 0}
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <InfoBar />
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
