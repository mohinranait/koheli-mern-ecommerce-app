"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Upload,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { defaultSiteSettings, SiteSettings } from "@/lib/site-settings";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (
    platform: keyof SiteSettings["socialMedia"],
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/site-settings`, {
        cache: "no-store",
      });
      const setting = await res.json();
      if (setting.success) {
        setSettings(setting.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ settings });

    try {
      const res = await fetch(`/api/site-settings`, {
        method: "PATCH",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({ ...settings }),
      });
      const resData = await res.json();

      if (resData.success) {
        toast.success("Setting updated");
        setIsLoading(false);
      }
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // alert("Settings saved successfully!")
  };

  const handleLogoUpload = () => {
    // Simulate logo upload
    alert("This feature under development");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your website's basic information and settings
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {settings.logo ? (
                      <img
                        src={settings.logo || "/placeholder.svg"}
                        alt="Logo"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogoUpload}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  placeholder="Enter site name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                placeholder="Enter meta title for SEO"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                placeholder="Enter meta description for SEO"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter business address"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Helpline Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notice Information */}
        <Card>
          <CardHeader>
            <CardTitle>Marque Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                onCheckedChange={(e) => {
                  setSettings((prev) => ({ ...prev, marqueStatus: e }));
                }}
                checked={settings?.marqueStatus}
                id="marqueStatus"
              />
              <Label htmlFor="marqueStatus">
                {" "}
                {settings?.marqueStatus ? "Enable" : "Disable"}{" "}
              </Label>
            </div>
            <div>
              <Label htmlFor="marque">Marque text</Label>
              <Textarea
                id="marque"
                value={settings.marque}
                onChange={(e) => handleInputChange("marque", e.target.value)}
                placeholder="Enter your notice"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook" className="flex items-center">
                  <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) =>
                    handleSocialMediaChange("facebook", e.target.value)
                  }
                  placeholder="https://facebook.com"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="flex items-center">
                  <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) =>
                    handleSocialMediaChange("twitter", e.target.value)
                  }
                  placeholder="https://twitter.com"
                />
              </div>

              <div>
                <Label htmlFor="instagram" className="flex items-center">
                  <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) =>
                    handleSocialMediaChange("instagram", e.target.value)
                  }
                  placeholder="https://instagram.com"
                />
              </div>

              <div>
                <Label htmlFor="youtube" className="flex items-center">
                  <Youtube className="w-4 h-4 mr-2 text-red-600" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  value={settings.socialMedia.youtube}
                  onChange={(e) =>
                    handleSocialMediaChange("youtube", e.target.value)
                  }
                  placeholder="https://youtube.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
