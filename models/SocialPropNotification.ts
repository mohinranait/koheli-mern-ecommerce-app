import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    beforeText: {
      type: String,
      trim: true,
    },
    afterText: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.SocialProof || mongoose.model("SocialProof", notificationSchema)
