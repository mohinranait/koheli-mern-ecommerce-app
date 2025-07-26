"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NotificationModal } from "@/components/admin-pages/notification-modal";
import { SocialProofNotification } from "@/types";
import { toast } from "sonner";
import moment from "moment";

export default function SocialProofAdminPage() {
  const [notifications, setNotifications] = useState<SocialProofNotification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedNotification, setSelectedNotification] =
    useState<SocialProofNotification | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/social-proof");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data);
      }
    } catch (error) {
      toast("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await fetch(`/api/social-proof/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications(notifications.filter((n) => n._id !== id));
        toast.success("Notification deleted successfully");
      }
    } catch (error) {
      toast("Failed to delete notification");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`/api/social-proof/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n._id === id
              ? { ...n, status: newStatus as "active" | "inactive" }
              : n
          )
        );
        toast.success(
          `${newStatus === "active" ? "Activated" : "Deactivated"}`
        );
      }
    } catch (error) {
      toast("Failed to update status");
    }
  };

  const handleCreate = () => {
    setSelectedNotification(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = (notification: SocialProofNotification) => {
    setSelectedNotification(notification);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchNotifications();
    setModalOpen(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Proof Notifications</CardTitle>
              <CardDescription>
                Manage social proof notifications that appear on your website
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Notification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No notifications found. Create your first notification!
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notification) => (
                    <TableRow key={notification._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={notification.image || "/placeholder.svg"}
                            alt={notification.title}
                            width={40}
                            height={40}
                            className=" object-cover h-12 w-12 rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div>
                          <span> {notification?.beforeText} </span>
                          <strong> {notification?.title} </strong>
                          <span> {notification?.afterText} </span>
                        </div>
                        <div className="truncate">{notification.afterText}</div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            notification.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer"
                          onClick={() =>
                            handleStatusToggle(
                              notification._id,
                              notification.status
                            )
                          }
                        >
                          {notification.status === "active" ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p>
                          {moment(notification.createdAt).format(
                            "MMM dd, YYYY"
                          )}
                        </p>
                        <p className="text-sm text-gray-700">
                          {moment(notification.createdAt).format("hh:mm A")}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(notification)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(notification._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NotificationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        notification={selectedNotification}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
