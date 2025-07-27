import type { AppConfigFormData } from "@/validations/app-config.schema"

export async function fetchAppConfig(): Promise<AppConfigFormData> {
  const response = await fetch("/api/app-config",{
    cache:'no-store'
  })
  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch app config")
  }

  return result.data
}

export async function updateAppConfig(data: AppConfigFormData): Promise<AppConfigFormData> {
  const response = await fetch("/api/app-config", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to update app config")
  }

  return result.data
}

export async function testCloudinaryConnection(config: AppConfigFormData["cloudinary"]): Promise<boolean> {
  // This would be implemented to actually test the connection
  // For now, we'll simulate it
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(config.cloudName !== "" && config.apiKey !== "" && config.apiSecret !== "")
    }, 1000)
  })
}

export async function testSmtpConnection(config: AppConfigFormData["smtp"]): Promise<boolean> {
  // This would be implemented to actually test the connection
  // For now, we'll simulate it
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(config.user !== "" && config.password !== "")
    }, 1000)
  })
}
