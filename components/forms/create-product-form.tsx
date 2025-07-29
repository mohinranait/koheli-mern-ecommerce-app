"use client";

import type React from "react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import slugify from "slugify";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useAppSelector } from "@/hooks/useRedux";
import { Loader2, Plus, Upload, X, ImageIcon } from "lucide-react";
import type { IProduct } from "@/types";
import z from "zod";
import Image from "next/image";
import { toast } from "sonner";

// Zod schema for form validation - price এখন required এবং empty string allow করে না
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  slug: z.string().optional(),
  price: z.number().min(0.01, "Price is required and must be greater than 0"), // 0.01 minimum দিয়ে empty value prevent করা
  image: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  priority: z.number().min(0, "Priority must be a positive number"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ProductFormData = z.infer<typeof productSchema>;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  editingProduct: IProduct | null;
  setEditingProduct: Dispatch<SetStateAction<IProduct | null>>;
  fetchProducts: () => Promise<void>;
};

const CreateProductForm = ({
  open,
  setOpen,
  editingProduct,
  setEditingProduct,
  fetchProducts,
}: Props) => {
  const { categories } = useAppSelector((state) => state.category);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // React Hook Form setup - default values থেকে price remove করা
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      // price: 0, // এই line remove করা হয়েছে
      image: "",
      category: "",
      description: "",
      status: "active",
      priority: 0,
      link: "",
    },
  });

  const { watch, setValue, reset } = form;
  const watchedName = watch("name");

  // Auto-generate slug when name changes
  useEffect(() => {
    if (watchedName) {
      const generatedSlug = slugify(watchedName, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [watchedName, setValue]);

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

  // Remove selected image
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    setValue("image", "");
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      let imageUrl = data.image;

      // If there's a new file selected, upload it first
      if (selectedFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(selectedFile);
          setValue("image", imageUrl);
        } catch (uploadError) {
          toast.warning("Image upload failed. Please try again.");
          console.error("Image upload error:", uploadError);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Submit product data with image URL
      const productData = { ...data, image: imageUrl };

      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        setOpen(false);
        resetForm();
        fetchProducts();
        toast.success(
          editingProduct
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
      } else {
        toast.warning(result.error || "Operation failed");
      }
    } catch (error) {
      toast.warning("Operation failed");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setSelectedFile(null);
    setImagePreview("");
    reset({
      name: "",
      slug: "",
      // price: 0, // এই line remove করা হয়েছে
      image: "",
      category: "",
      description: "",
      status: "active",
      priority: 0,
      link: "",
    });
  };

  useEffect(() => {
    const product = editingProduct;
    if (!product?._id) {
      return;
    }

    reset({
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      status: product.status,
      priority: product.priority,
      link: product.link || "",
    });

    // Set image preview for editing
    if (product.image) {
      setImagePreview(product.image);
    }
  }, [editingProduct, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price" // placeholder text change করা
                        {...field}
                        value={field.value || ""} // এখানে empty string show করার জন্য
                        onChange={(e) => {
                          const value = e.target.value;
                          // Empty string হলে undefined set করা, নাহলে number convert করা
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
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
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category?._id} value={category?._id}>
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || uploadingImage}
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading Image...
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingProduct ? "Updating..." : "Adding..."}
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;
