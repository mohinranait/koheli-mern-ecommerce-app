"use client";

import type React from "react";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Calendar,
  Phone,
  Package,
  Loader2,
} from "lucide-react";
import moment from "moment";
import { IOrder, TOrderStatus } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import GlobalPagination from "@/components/paginations";

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Client-side filtering using useMemo
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Search filter - search in customer name, phone, product name, address
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(query) ||
          order.phone.toLowerCase().includes(query) ||
          order.productName.toLowerCase().includes(query) ||
          order.address.toLowerCase().includes(query) ||
          order._id.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = moment();
      filtered = filtered.filter((order) => {
        const orderDate = moment(order.createdAt);
        switch (dateFilter) {
          case "today":
            return orderDate.isSame(now, "day");
          case "week":
            return orderDate.isAfter(now.clone().subtract(7, "days"));
          case "month":
            return orderDate.isAfter(now.clone().subtract(30, "days"));
          default:
            return true;
        }
      });
    }

    // Sort by creation date (newest first)
    return filtered.sort(
      (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
    );
  }, [allOrders, searchQuery, statusFilter, dateFilter]);

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
      // Update local state instead of refetching
      setAllOrders((prev) =>
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
      setIsLoading(true);
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      setAllOrders(data.data as IOrder[]);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Get statistics for dashboard
  const orderStats = useMemo(() => {
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === "pending").length,
      confirmed: filteredOrders.filter((o) => o.status === "confirmed").length,
      delivered: filteredOrders.filter((o) => o.status === "delivered").length,
      cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
    };
  }, [filteredOrders]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handlePageChange = (page: number, limit: number) => {
    setCurrentPage(page);
    setItemsPerPage(limit);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage customer orders and track deliveries
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{orderStats.total}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{orderStats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{orderStats.confirmed}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{orderStats.delivered}</p>
                <p className="text-sm text-gray-600">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{orderStats.cancelled}</p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer name, phone, product, address, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredOrders.length} of {allOrders.length} orders
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Orders List */}
          <div className="grid gap-6">
            {paginatedOrders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {order.productName}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Order ID: {order._id}
                      </p>
                    </div>
                    <Badge
                      className={`capitalize ${getStatusColor(order.status)}`}
                    >
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
                      <p className="text-sm text-gray-600">
                        <Link
                          href={`tel:${order?.phone}`}
                          className="flex items-center hover:text-blue-600"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {order.phone}
                        </Link>
                      </p>
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
                      <p className="text-sm text-blue-700">
                        {order.adminMessage}
                      </p>
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`tel:${order.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Link>
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

          {filteredOrders?.length > 0 && (
            <div>
              <GlobalPagination
                totalItems={filteredOrders?.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No Orders Found */}
          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

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
