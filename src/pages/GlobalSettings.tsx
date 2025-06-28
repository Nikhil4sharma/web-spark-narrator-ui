import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Globe, Mail, Shield, Palette, Loader2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GlobalSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Site Information
    siteName: "WebStory Hub",
    siteDescription: "Discover amazing web stories that captivate and inspire",
    siteUrl: "https://webstoryhub.com",
    contactEmail: "admin@webstoryhub.com",
    
    // Content Settings
    storiesPerPage: "12",
    enableComments: true,
    enableSharing: true,
    autoApproveStories: false,
    
    // SEO Settings
    metaTitle: "WebStory Hub - Amazing Visual Stories",
    metaDescription: "Discover and create immersive visual stories that captivate and inspire readers worldwide.",
    enableSEO: true,
    
    // Social Media
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    
    // Theme Settings
    primaryColor: "#3b82f6",
    enableDarkMode: true,
    defaultTheme: "light",
    
    // Analytics
    googleAnalyticsId: "",
    enableAnalytics: false,
    
    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    enableEmailNotifications: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your global settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings({
        siteName: "WebStory Hub",
        siteDescription: "Discover amazing web stories that captivate and inspire",
        siteUrl: "https://webstoryhub.com",
        contactEmail: "admin@webstoryhub.com",
        storiesPerPage: "12",
        enableComments: true,
        enableSharing: true,
        autoApproveStories: false,
        metaTitle: "WebStory Hub - Amazing Visual Stories",
        metaDescription: "Discover and create immersive visual stories that captivate and inspire readers worldwide.",
        enableSEO: true,
        facebookUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
        primaryColor: "#3b82f6",
        enableDarkMode: true,
        defaultTheme: "light",
        googleAnalyticsId: "",
        enableAnalytics: false,
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: "",
        enableEmailNotifications: false,
      });
      toast({
        title: "Settings reset",
        description: "All settings have been reset to default values.",
      });
    }
  };

  return (
    <AdminLayout title="Global Settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Global Settings</h2>
            <p className="text-muted-foreground">Configure your website's global settings and preferences</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Site Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="Your website name"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  placeholder="Brief description of your website"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="contact@yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storiesPerPage">Stories per Page</Label>
                <Select
                  value={settings.storiesPerPage}
                  onValueChange={(value) => setSettings({ ...settings, storiesPerPage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 stories</SelectItem>
                    <SelectItem value="12">12 stories</SelectItem>
                    <SelectItem value="18">18 stories</SelectItem>
                    <SelectItem value="24">24 stories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Comments</Label>
                  <p className="text-sm text-muted-foreground">Allow users to comment on stories</p>
                </div>
                <Switch
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableComments: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow users to share stories</p>
                </div>
                <Switch
                  checked={settings.enableSharing}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableSharing: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-approve Stories</Label>
                  <p className="text-sm text-muted-foreground">Automatically publish new stories</p>
                </div>
                <Switch
                  checked={settings.autoApproveStories}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoApproveStories: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SEO</Label>
                  <p className="text-sm text-muted-foreground">Optimize for search engines</p>
                </div>
                <Switch
                  checked={settings.enableSEO}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableSEO: checked })}
                />
              </div>
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  placeholder="Default page title"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  placeholder="Default page description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow users to switch themes</p>
                </div>
                <Switch
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableDarkMode: checked })}
                />
              </div>
              <div>
                <Label htmlFor="defaultTheme">Default Theme</Label>
                <Select
                  value={settings.defaultTheme}
                  onValueChange={(value) => setSettings({ ...settings, defaultTheme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground">Track website usage</p>
                </div>
                <Switch
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
                />
              </div>
              <div>
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications for new stories and comments</p>
              </div>
              <Switch
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableEmailNotifications: checked })}
              />
            </div>

            {settings.enableEmailNotifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                    placeholder="Your email password"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default GlobalSettings;
