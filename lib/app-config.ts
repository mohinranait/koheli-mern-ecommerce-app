export interface AppConfig {
  cloudinary: {
    cloudName: string
    apiKey: string
    apiSecret: string
    enabled: boolean
  }
  smtp: {
    user: string
    password: string
    host: string
    port: number
    enabled: boolean
  }
  crisp: {
    websiteId: string
    enabled: boolean
  }
}

export const defaultAppConfig: AppConfig = {
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
