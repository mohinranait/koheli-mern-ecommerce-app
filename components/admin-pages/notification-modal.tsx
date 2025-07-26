"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SocialProofNotification } from "@/types";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  notification?: SocialProofNotification | null;
  onSuccess: () => void;
}

export function NotificationModal({
  open,
  onOpenChange,
  mode,
  notification,
  onSuccess,
}: NotificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    beforeText: "",
    afterText: "",
    title: "",
    image: "",
    status: "active" as "active" | "inactive",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const isEditMode = mode === "edit";

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (isEditMode && notification) {
        setFormData({
          beforeText: notification.beforeText,
          afterText: notification.afterText,
          title: notification.title,
          status: notification.status,
          image: notification?.image,
        });

        setPhotoPreview(notification?.image);
      } else {
        resetForm();
      }
    }
  }, [open, mode, notification, isEditMode]);

  const resetForm = () => {
    setFormData({
      afterText: "",
      beforeText: "",
      title: "",
      image: "",
      status: "active",
    });
    setPhotoPreview("");
  };

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Image upload failed");
    }

    return result.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for create mode
    if (!isEditMode && !selectedFile) {
      toast.warning("Please upload  photo");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = notification?.image ? notification?.image : "";

      // If there's a new file selected, upload it first
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
          setFormData((prev) => ({ ...prev, image: imageUrl }));
        } catch (uploadError) {
          toast.warning("Image upload failed. Please try again.");
          console.error("Image upload error:", uploadError);
          return;
        } finally {
        }
      }

      const url = isEditMode
        ? `/api/social-proof/${notification?._id}`
        : "/api/social-proof";
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (response.ok) {
        toast(`Notification successfully`);
        onSuccess();
        if (!isEditMode) {
          resetForm();
        }
      } else {
        throw new Error(
          `Failed to ${isEditMode ? "update" : "create"} notification`
        );
      }
    } catch (error) {
      toast("Error");
    } finally {
      setLoading(false);
    }
  };

  const removePhotoPreview = () => {
    setPhotoPreview("");
  };

  const handleClose = () => {
    onOpenChange(false);
    if (!isEditMode) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-100px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Notification" : "Create New Notification"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the social proof notification details."
              : "Add a new social proof notification to display on your website."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="beforeText">Before Text</Label>
              <Input
                id="beforeText"
                value={formData.beforeText}
                onChange={(e) =>
                  setFormData({ ...formData, beforeText: e.target.value })
                }
                placeholder="Before text"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Bold Text</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="after">After Text</Label>
              <Input
                id="after"
                value={formData.afterText}
                onChange={(e) =>
                  setFormData({ ...formData, afterText: e.target.value })
                }
                placeholder="After text"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userPhoto">Photo</Label>
              {photoPreview ? (
                <div className="relative w-20 h-20">
                  <Image
                    src={photoPreview || "/placeholder.svg"}
                    alt="User photo preview"
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removePhotoPreview}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Click to upload user photo
                      </span>
                      <input
                        id="image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUserPhotoChange}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Notification"
                : "Create Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
