import { z } from "zod"

export const appConfigSchema = z.object({
  cloudinary: z
    .object({
      cloudName: z.string().optional(),
      apiKey: z.string().optional(),
      apiSecret: z.string().optional(),
      enabled: z.boolean().default(false),
    })
    .refine(
      (data) => {
        if (data.enabled) {
          return data.cloudName && data.apiKey && data.apiSecret
        }
        return true
      },
      {
        message: "All Cloudinary fields are required when enabled",
        path: ["cloudName"],
      },
    ),
  smtp: z
    .object({
      user: z.string().email().optional().or(z.literal("")),
      password: z.string().optional(),
      host: z.string().default("smtp.gmail.com"),
      port: z.number().min(1).max(65535).default(587),
      enabled: z.boolean().default(false),
    })
    .refine(
      (data) => {
        if (data.enabled) {
          return data.user && data.password && data.host && data.port
        }
        return true
      },
      {
        message: "All SMTP fields are required when enabled",
        path: ["user"],
      },
    ),
  crisp: z
    .object({
      websiteId: z.string().optional(),
      enabled: z.boolean().default(false),
    })
    .refine(
      (data) => {
        if (data.enabled) {
          return data.websiteId && data.websiteId.length > 0
        }
        return true
      },
      {
        message: "Website ID is required when Crisp is enabled",
        path: ["websiteId"],
      },
    ),
})

export type AppConfigFormData = z.infer<typeof appConfigSchema>

export const defaultAppConfig: AppConfigFormData = {
  cloudinary: {
    cloudName: "",
    apiKey: "",
    apiSecret: "",
    enabled: false,
  },
  smtp: {
    user: "",
    password: "",
    host: "smtp.gmail.com",
    port: 587,
    enabled: false,
  },
  crisp: {
    websiteId: "",
    enabled: false,
  },
}
