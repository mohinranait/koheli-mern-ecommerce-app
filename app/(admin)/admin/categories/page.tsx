"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { ICategory } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

// Zod validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters"),
  slug: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // React Hook Form setup
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
    },
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/categories?${params}`);
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error || "Failed to fetch categories");
      }
    } catch (error) {
      setError("Failed to fetch categories");
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  // Upload image to server
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

  const handleSubmit = async (values: CategoryFormValues) => {
    setSubmitting(true);
    setError("");

    try {
      let imageUrl = values.image;

      // If there's a new file selected, upload it first
      if (selectedFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadError) {
          toast.warning("Image upload failed. Please try again.");
          console.error("Image upload error:", uploadError);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const productData = { ...values, image: imageUrl };

      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        setIsDialogOpen(false);
        setEditingCategory(null);
        setImagePreview("");
        form.reset();
        setSelectedFile(null);
        toast.success(
          editingCategory
            ? "Category updated successfully!"
            : "Category added successfully!"
        );
      } else {
        setError(result.error || "Operation failed");
      }
    } catch (error) {
      setError("Operation failed");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      image: category.image,
    });
    setIsDialogOpen(true);
    if (category.image) {
      setImagePreview(category.image);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        toast("Category deleted successfully!");
      } else {
        toast(result.error || "Failed to delete category");
      }
    } catch (error) {
      toast("Failed to delete category");
      console.error("Delete error:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.warning(
          "Please select a valid image file (JPEG, PNG, GIF, WebP)"
        );
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    form.setValue("slug", slug);
    return name;
  };

  const handleDialogOpen = () => {
    setEditingCategory(null);
    form.reset({
      name: "",
      slug: "",
      image: "",
    });
    setError("");
    setImagePreview("");
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    form.setValue("image", "");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleDialogOpen}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100vh-100px)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleNameChange(e.target.value))
                          }
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly disabled={submitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Section */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Image Preview */}
                          {imagePreview && (
                            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="Category preview"
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {/* File Input */}
                          {!imagePreview && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                              <div className="text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                  <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer"
                                  >
                                    <span className="mt-2 block text-sm font-medium text-gray-900">
                                      Click to upload image
                                    </span>
                                    <span className="mt-1 block text-xs text-gray-500">
                                      PNG, JPG, GIF up to 10MB
                                    </span>
                                  </label>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Change Image Button */}
                          {imagePreview && (
                            <div className="flex justify-center">
                              <label
                                htmlFor="image-upload-change"
                                className="cursor-pointer"
                              >
                                <Button type="button" variant="outline" asChild>
                                  <span>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Change Image
                                  </span>
                                </Button>
                                <input
                                  id="image-upload-change"
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleFileSelect}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingCategory ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {category.name}
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-2">
                  {category.slug}
                </Badge>
                <p className="text-sm text-gray-600">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No categories found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
