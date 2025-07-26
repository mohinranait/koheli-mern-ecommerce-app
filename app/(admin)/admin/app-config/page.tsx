"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Save,
  Cloud,
  Mail,
  MessageCircle,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info,
  Loader2,
} from "lucide-react";
import {
  appConfigSchema,
  type AppConfigFormData,
  defaultAppConfig,
} from "@/validations/app-config.schema";
import {
  fetchAppConfig,
  updateAppConfig,
  testCloudinaryConnection,
  testSmtpConnection,
} from "@/actions/app-config-api";
import { toast } from "sonner";

export default function AppConfigPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingCloudinary, setIsTestingCloudinary] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    cloudinarySecret: false,
    smtpPassword: false,
  });

  const form = useForm<AppConfigFormData>({
    resolver: zodResolver(appConfigSchema),
    defaultValues: defaultAppConfig,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  // Watch for enabled states
  const cloudinaryEnabled = watch("cloudinary.enabled");
  const smtpEnabled = watch("smtp.enabled");
  const crispEnabled = watch("crisp.enabled");

  // Load initial data
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchAppConfig();
        // Reset form with fetched data
        form.reset(config);
      } catch (error) {
        toast("Failed to load configuration");
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [form, toast]);

  const onSubmit = async (data: AppConfigFormData) => {
    setIsSaving(true);
    try {
      await updateAppConfig(data);
      toast("App configuration saved successfully!");
    } catch (error) {
      toast("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestCloudinary = async () => {
    const cloudinaryConfig = watch("cloudinary");

    if (
      !cloudinaryConfig.cloudName ||
      !cloudinaryConfig.apiKey ||
      !cloudinaryConfig.apiSecret
    ) {
      toast.warning("Please fill in all Cloudinary credentials first");
      return;
    }

    setIsTestingCloudinary(true);
    try {
      const success = await testCloudinaryConnection(cloudinaryConfig);
      if (success) {
        toast.success("Cloudinary connection successful!");
      } else {
        toast.warning("Failed to connect to Cloudinary");
      }
    } catch (error) {
      toast("Failed to test Cloudinary connection");
    } finally {
      setIsTestingCloudinary(false);
    }
  };

  const handleTestSmtp = async () => {
    const smtpConfig = watch("smtp");

    if (!smtpConfig.user || !smtpConfig.password) {
      toast("Please fill in SMTP credentials first");
      return;
    }

    setIsTestingSmtp(true);
    try {
      const success = await testSmtpConnection(smtpConfig);
      if (success) {
        toast.success("SMTP connection successful!");
      } else {
        toast.warning("Failed to connect to SMTP server");
      }
    } catch (error) {
      toast("Failed to test SMTP connection");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">App Configuration</h1>
        <p className="text-gray-600 mt-2">
          Configure third-party services and integrations
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <p className="text-sm text-gray-600">
                      Image and video management service
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={cloudinaryEnabled ? "default" : "secondary"}>
                    {cloudinaryEnabled ? (
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
                  <FormField
                    control={form.control}
                    name="cloudinary.enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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
                <FormField
                  control={form.control}
                  name="cloudinary.cloudName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cloud Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="your-cloud-name"
                          disabled={!cloudinaryEnabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cloudinary.apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123456789012345"
                          disabled={!cloudinaryEnabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cloudinary.apiSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Secret</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={
                            showPasswords.cloudinarySecret ? "text" : "password"
                          }
                          placeholder="your-api-secret"
                          disabled={!cloudinaryEnabled}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            togglePasswordVisibility("cloudinarySecret")
                          }
                          disabled={!cloudinaryEnabled}
                        >
                          {showPasswords.cloudinarySecret ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errors.cloudinary?.root && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.cloudinary.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestCloudinary}
                  disabled={!cloudinaryEnabled || isTestingCloudinary}
                >
                  {isTestingCloudinary ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
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
                    <p className="text-sm text-gray-600">
                      Email sending configuration
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={smtpEnabled ? "default" : "secondary"}>
                    {smtpEnabled ? (
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
                  <FormField
                    control={form.control}
                    name="smtp.enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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
                <FormField
                  control={form.control}
                  name="smtp.host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="smtp.gmail.com"
                          disabled={!smtpEnabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtp.port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="587"
                          disabled={!smtpEnabled}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseInt(e.target.value) || 587
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="smtp.user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP User (Email)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your-email@gmail.com"
                        disabled={!smtpEnabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtp.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={
                            showPasswords.smtpPassword ? "text" : "password"
                          }
                          placeholder="your-app-password"
                          disabled={!smtpEnabled}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            togglePasswordVisibility("smtpPassword")
                          }
                          disabled={!smtpEnabled}
                        >
                          {showPasswords.smtpPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errors.smtp?.root && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.smtp.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestSmtp}
                  disabled={!smtpEnabled || isTestingSmtp}
                >
                  {isTestingSmtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
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
                    <p className="text-sm text-gray-600">
                      Customer support live chat
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={crispEnabled ? "default" : "secondary"}>
                    {crispEnabled ? (
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
                  <FormField
                    control={form.control}
                    name="crisp.enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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

              <FormField
                control={form.control}
                name="crisp.websiteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        disabled={!crispEnabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errors.crisp?.root && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.crisp.root.message}
                  </AlertDescription>
                </Alert>
              )}

              {crispEnabled && watch("crisp.websiteId") && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Crisp chat widget will appear on your website when this
                    configuration is saved.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
      </Form>
    </div>
  );
}
