export interface SiteSettings {
  logo: string
  siteName: string
  metaTitle: string
  metaDescription: string
  address: string
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
  logo: "/placeholder.svg?height=40&width=40",
  siteName: "ShopBD",
  metaTitle: "ShopBD - Your Online Shopping Destination",
  metaDescription: "Shop furniture, electronics, and fashion at the best prices in Bangladesh",
  address: "Dhaka, Bangladesh",
  phone: "+880 1712-345678",
  email: "info@shopbd.com",
  socialMedia: {
    facebook: "https://facebook.com/shopbd",
    twitter: "https://twitter.com/shopbd",
    instagram: "https://instagram.com/shopbd",
    youtube: "https://youtube.com/shopbd",
  },
}
