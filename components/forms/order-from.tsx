"use client";
import { IProduct } from "@/types";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useRedux";
import { setAuthUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

// Zod validation schema
const orderSchema = z.object({
  customerName: z.string().optional(),
  phone: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(
      /^01[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number (e.g., 01712345678)"
    ),
  address: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

type Props = {
  product: IProduct;
};

const OrderForm = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    try {
      // Simulate API call
      const payloadData = {
        ...data,
        productImg: product?.image,
        productName: product?.name,
        price: product?.price,
        productId: product?._id,
        address: data.address ? data?.address : "No address",
        customerName: data.customerName ? data?.customerName : "Not provided",
      };

      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });

      const result = await response.json();

      if (result.success) {
        dispatch(setAuthUser(result.data));
        router.push("/dashboard");
        toast.success("Order place successfully");
      }

      reset();
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="customerName">Full Name</Label>
        <Input
          id="customerName"
          {...register("customerName")}
          className={errors.customerName ? "border-red-500" : ""}
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.customerName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder=""
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Delivery Address</Label>
        <Textarea
          id="address"
          {...register("address")}
          rows={3}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">Quantity:</span>
          <span className="font-bold text-primary">1 item</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-primary">
            ৳{product.price.toFixed(2)}
          </span>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing Order..." : "Confirm Order"}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
