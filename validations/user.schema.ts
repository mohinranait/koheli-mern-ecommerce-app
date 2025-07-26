// lib/validations/user.ts

import { z } from "zod";

// User form validation schema
export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim(),
  
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number (e.g., 01712345678)")
    .length(11, "Phone number must be exactly 11 digits"),
  
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters")
    .trim(),
  
  role: z
    .enum(["admin", "user"], {
      required_error: "Please select a role",
      invalid_type_error: "Role must be either admin or user",
    }),
  
  status: z
    .enum(["active", "inactive"], {
      required_error: "Please select a status",
      invalid_type_error: "Status must be either active or inactive",
    }),
});

// User update schema (all fields optional except id)
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim()
    .optional(),
  
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number")
    .length(11, "Phone number must be exactly 11 digits")
    .optional(),
  
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters")
    .trim()
    .optional(),
  
  role: z
    .enum(["admin", "user"])
    .optional(),
  
  status: z
    .enum(["active", "inactive"])
    .optional(),
});

// Type inference from schema
export type UserFormData = z.infer<typeof userFormSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;