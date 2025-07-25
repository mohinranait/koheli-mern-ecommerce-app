import mongoose from "mongoose"

const AppConfigSchema = new mongoose.Schema(
  {
    cloudinary: {
      cloudName: { type: String, default: "" },
      apiKey: { type: String, default: "" },
      apiSecret: { type: String, default: "" },
      enabled: { type: Boolean, default: false },
    },
    smtp: {
      user: { type: String, default: "" },
      password: { type: String, default: "" },
      host: { type: String, default: "smtp.gmail.com" },
      port: { type: Number, default: 587 },
      enabled: { type: Boolean, default: false },
    },
    crisp: {
      websiteId: { type: String, default: "" },
      enabled: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.AppConfig || mongoose.model("AppConfig", AppConfigSchema)
