export interface SiteSettings {
  logo: string
  siteName: string
  metaTitle: string
  metaDescription: string
  address: string
  marque: string
  marqueStatus: boolean
  phone: string
  email: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
}

export const defaultSiteSettings: SiteSettings = {
  logo: "/placeholder.webp?height=40&width=40",
  siteName: "Koholi",
  metaTitle: "Koholi",
  metaDescription: "",
  address: "",
  marque: "",
  marqueStatus: true,
  phone: "",
  email: "",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  },
}
