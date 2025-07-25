import mongoose from "mongoose"

const SiteSettingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: "/placeholder.svg?height=40&width=40",
    },
    siteName: {
      type: String,
      default: "ShopBD",
    },
    metaTitle: {
      type: String,
      default: "ShopBD - Your Online Shopping Destination",
    },
    metaDescription: {
      type: String,
      default: "Shop furniture, electronics, and fashion at the best prices in Bangladesh",
    },
    address: {
      type: String,
      default: "Dhaka, Bangladesh",
    },
    phone: {
      type: String,
      default: "+880 1712-345678",
    },
    email: {
      type: String,
      default: "info@shopbd.com",
    },
    socialMedia: {
      facebook: { type: String, default: "https://facebook.com/shopbd" },
      twitter: { type: String, default: "https://twitter.com/shopbd" },
      instagram: { type: String, default: "https://instagram.com/shopbd" },
      youtube: { type: String, default: "https://youtube.com/shopbd" },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema)
