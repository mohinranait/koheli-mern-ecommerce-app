"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send } from "lucide-react";
import moment from "moment";
import { IOrder, TOrderStatus } from "@/types";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orderList, setOrderList] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

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

  const updateOrders = async ({
    orderId,
    payload,
  }: {
    orderId: string;
    payload: any;
  }) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) {
      setOrderList((prev) =>
        prev?.map((order) =>
          order?._id === data?.data?._id ? data?.data : order
        )
      );
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: TOrderStatus
  ) => {
    updateOrders({ orderId: orderId, payload: { status: newStatus } });
    toast.success("Status updated successfully!");
  };

  const handleSendMessage = (order: IOrder) => {
    setSelectedOrder(order);
    setAdminMessage(order.adminMessage || "");
    setIsMessageDialogOpen(true);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminMessage.trim() && selectedOrder) {
      updateOrders({
        orderId: selectedOrder?._id,
        payload: { adminMessage: adminMessage },
      });

      toast.success("Message sent to customer successfully!");
      setIsMessageDialogOpen(false);
      setAdminMessage("");
      setSelectedOrder(null);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      setOrderList(data.data as IOrder[]);
    } catch (error) {}
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="grid gap-6">
        {orderList.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.productName}</CardTitle>
                  <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                </div>
                <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">
                    Customer
                  </h4>
                  <p>{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-600">
                    Address
                  </h4>
                  <p className="text-sm">{order.address}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-600">
                    Order Date
                  </h4>
                  <p>{moment(order?.createdAt).format("MMM DD, YYYY")}</p>
                  <p>{moment(order?.createdAt).format("h:mm A")}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-600">
                    Amount
                  </h4>
                  <p className="text-lg font-bold text-primary">
                    ৳{order.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Admin Message Display */}
              {order.adminMessage && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-sm text-blue-800 mb-1">
                    Admin Message:
                  </h5>
                  <p className="text-sm text-blue-700">{order.adminMessage}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(order._id, value as TOrderStatus)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Customer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(order)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {order.adminMessage ? "Edit Message" : "Send Message"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMessageSubmit} className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="Write your message to the customer..."
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMessageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
