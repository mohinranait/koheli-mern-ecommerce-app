"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Cloud, Mail, MessageCircle, Eye, EyeOff, CheckCircle, XCircle, Info } from "lucide-react"
import { defaultAppConfig, type AppConfig } from "@/lib/app-config"

export default function AppConfigPage() {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    cloudinarySecret: false,
    smtpPassword: false,
  })

  const handleCloudinaryChange = (field: keyof AppConfig["cloudinary"], value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      cloudinary: {
        ...prev.cloudinary,
        [field]: value,
      },
    }))
  }

  const handleSmtpChange = (field: keyof AppConfig["smtp"], value: string | boolean | number) => {
    setConfig((prev) => ({
      ...prev,
      smtp: {
        ...prev.smtp,
        [field]: value,
      },
    }))
  }

  const handleCrispChange = (field: keyof AppConfig["crisp"], value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      crisp: {
        ...prev.crisp,
        [field]: value,
      },
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert("App configuration saved successfully!")
    setIsLoading(false)
  }

  const testCloudinaryConnection = () => {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      alert("Please fill in all Cloudinary credentials first")
      return
    }
    alert("Testing Cloudinary connection... (This would test the actual connection)")
  }

  const testSmtpConnection = () => {
    if (!config.smtp.user || !config.smtp.password) {
      alert("Please fill in SMTP credentials first")
      return
    }
    alert("Testing SMTP connection... (This would test the actual connection)")
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">App Configuration</h1>
        <p className="text-gray-600 mt-2">Configure third-party services and integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cloudinary Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Cloudinary</CardTitle>
                  <p className="text-sm text-gray-600">Image and video management service</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={config.cloudinary.enabled ? "default" : "secondary"}>
                  {config.cloudinary.enabled ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Disabled
                    </>
                  )}
                </Badge>
                <Switch
                  checked={config.cloudinary.enabled}
                  onCheckedChange={(checked) => handleCloudinaryChange("enabled", checked)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Get your Cloudinary credentials from your{" "}
                <a
                  href="https://cloudinary.com/console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Cloudinary Console
                </a>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cloudName">Cloud Name</Label>
                <Input
                  id="cloudName"
                  value={config.cloudinary.cloudName}
                  onChange={(e) => handleCloudinaryChange("cloudName", e.target.value)}
                  placeholder="your-cloud-name"
                  disabled={!config.cloudinary.enabled}
                />
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={config.cloudinary.apiKey}
                  onChange={(e) => handleCloudinaryChange("apiKey", e.target.value)}
                  placeholder="123456789012345"
                  disabled={!config.cloudinary.enabled}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="apiSecret">API Secret</Label>
              <div className="relative">
                <Input
                  id="apiSecret"
                  type={showPasswords.cloudinarySecret ? "text" : "password"}
                  value={config.cloudinary.apiSecret}
                  onChange={(e) => handleCloudinaryChange("apiSecret", e.target.value)}
                  placeholder="your-api-secret"
                  disabled={!config.cloudinary.enabled}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("cloudinarySecret")}
                  disabled={!config.cloudinary.enabled}
                >
                  {showPasswords.cloudinarySecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={testCloudinaryConnection}
                disabled={!config.cloudinary.enabled}
              >
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SMTP Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>SMTP Email</CardTitle>
                  <p className="text-sm text-gray-600">Email sending configuration</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={config.smtp.enabled ? "default" : "secondary"}>
                  {config.smtp.enabled ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Disabled
                    </>
                  )}
                </Badge>
                <Switch
                  checked={config.smtp.enabled}
                  onCheckedChange={(checked) => handleSmtpChange("enabled", checked)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                For Gmail, use your email and an{" "}
                <a
                  href="https://support.google.com/accounts/answer/185833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  App Password
                </a>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={config.smtp.host}
                  onChange={(e) => handleSmtpChange("host", e.target.value)}
                  placeholder="smtp.gmail.com"
                  disabled={!config.smtp.enabled}
                />
              </div>

              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={config.smtp.port}
                  onChange={(e) => handleSmtpChange("port", Number.parseInt(e.target.value) || 587)}
                  placeholder="587"
                  disabled={!config.smtp.enabled}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="smtpUser">SMTP User (Email)</Label>
              <Input
                id="smtpUser"
                type="email"
                value={config.smtp.user}
                onChange={(e) => handleSmtpChange("user", e.target.value)}
                placeholder="your-email@gmail.com"
                disabled={!config.smtp.enabled}
              />
            </div>

            <div>
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <div className="relative">
                <Input
                  id="smtpPassword"
                  type={showPasswords.smtpPassword ? "text" : "password"}
                  value={config.smtp.password}
                  onChange={(e) => handleSmtpChange("password", e.target.value)}
                  placeholder="your-app-password"
                  disabled={!config.smtp.enabled}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("smtpPassword")}
                  disabled={!config.smtp.enabled}
                >
                  {showPasswords.smtpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={testSmtpConnection} disabled={!config.smtp.enabled}>
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crisp Live Chat */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Crisp Live Chat</CardTitle>
                  <p className="text-sm text-gray-600">Customer support live chat</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={config.crisp.enabled ? "default" : "secondary"}>
                  {config.crisp.enabled ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Disabled
                    </>
                  )}
                </Badge>
                <Switch
                  checked={config.crisp.enabled}
                  onCheckedChange={(checked) => handleCrispChange("enabled", checked)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Get your Website ID from your{" "}
                <a
                  href="https://app.crisp.chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Crisp Dashboard
                </a>
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="crispWebsiteId">Website ID</Label>
              <Input
                id="crispWebsiteId"
                value={config.crisp.websiteId}
                onChange={(e) => handleCrispChange("websiteId", e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                disabled={!config.crisp.enabled}
              />
            </div>

            {config.crisp.enabled && config.crisp.websiteId && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Crisp chat widget will appear on your website when this configuration is saved.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
