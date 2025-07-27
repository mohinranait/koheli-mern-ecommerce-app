import mongoose from "mongoose"

const SiteSettingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default:'/placeholder.webp?height=40&width=40'
    },
    siteName: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    marque: {
      type: String,
    },
    marqueStatus: {
      type: Boolean,
      default:true
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    socialMedia: {
      facebook: { type: String, },
      twitter: { type: String,  },
      instagram: { type: String,  },
      youtube: { type: String,  },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema)
