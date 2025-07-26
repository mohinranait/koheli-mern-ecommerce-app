"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const loginSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(
      /^01[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number (e.g., 01XXXXXXXXX)"
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();

      if (resData.success) {
        // Store user data
        localStorage.setItem("user", JSON.stringify(resData?.data));

        // Reset form
        reset();

        // Navigate immediately without toast to avoid render conflicts
        if (resData?.data?.role === "user") {
          router.push("/dashboard");
        } else {
          router.push("/admin");
        }
      } else {
        // Handle API error response
        toast.error(
          resData?.message || "Login failed. Please check your phone number."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={`${
                    errors.phone &&
                    "focus-visible:ring-red-500 ring-2 ring-red-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
