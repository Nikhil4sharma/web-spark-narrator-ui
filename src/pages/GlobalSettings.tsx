import { useState, useEffect } from "react";
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
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";

const defaultSettings = {
  site_name: "Aaj ki Story",
  site_description: "Discover amazing web stories that captivate and inspire",
  site_url: "https://aajkistory.com",
  contact_email: "admin@aajkistory.com",
  stories_per_page: 12,
  enable_comments: true,
  enable_sharing: true,
  auto_approve_stories: false,
  meta_title: "Aaj ki Story - Amazing Visual Stories",
  meta_description: "Discover and create immersive visual stories that captivate and inspire readers worldwide.",
  enable_seo: true,
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  linkedin_url: "",
  primary_color: "#e11d48",
  enable_dark_mode: true,
  default_theme: "light",
  google_analytics_id: "",
  enable_analytics: false,
  smtp_host: "",
  smtp_port: "587",
  smtp_user: "",
  smtp_password: "",
  enable_email_notifications: false,
};

const GlobalSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch settings from Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setFetchError(null);
      const { data, error } = await supabase.from("settings").select("*").limit(1).single();
      if (error) {
        setFetchError("Failed to fetch settings from Supabase.");
        setIsLoading(false);
        return;
      }
      setSettings({ ...defaultSettings, ...data });
      setSettingsId(data.id);
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  // Save settings to Supabase
  const handleSave = async () => {
    setIsLoading(true);
    if (!settingsId) {
      toast({ title: "Error", description: "Settings ID not found.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const { error } = await supabase.from("settings").update(settings).eq("id", settingsId);
    if (error) {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    } else {
      toast({ title: "Settings saved", description: "Your global settings have been updated successfully." });
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings(defaultSettings);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
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
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name || ""}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      placeholder="Your website name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={settings.site_description || ""}
                      onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                      placeholder="Brief description of your website"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_url">Site URL</Label>
                    <Input
                      id="site_url"
                      value={settings.site_url || ""}
                      onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email || ""}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
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
                    <Label htmlFor="stories_per_page">Stories per Page</Label>
                    <Select
                      value={(settings.stories_per_page ?? 12).toString()}
                      onValueChange={(value) => setSettings({ ...settings, stories_per_page: parseInt(value) })}
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
                      checked={settings.enable_comments}
                      onCheckedChange={(checked) => setSettings({ ...settings, enable_comments: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Sharing</Label>
                      <p className="text-sm text-muted-foreground">Allow users to share stories</p>
                    </div>
                    <Switch
                      checked={settings.enable_sharing}
                      onCheckedChange={(checked) => setSettings({ ...settings, enable_sharing: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-approve Stories</Label>
                      <p className="text-sm text-muted-foreground">Automatically publish new stories</p>
                    </div>
                    <Switch
                      checked={settings.auto_approve_stories}
                      onCheckedChange={(checked) => setSettings({ ...settings, auto_approve_stories: checked })}
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
                      checked={settings.enable_seo}
                      onCheckedChange={(checked) => setSettings({ ...settings, enable_seo: checked })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={settings.meta_title || ""}
                      onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                      placeholder="Default page title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={settings.meta_description || ""}
                      onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
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
                    <Label htmlFor="facebook_url">Facebook URL</Label>
                    <Input
                      id="facebook_url"
                      value={settings.facebook_url || ""}
                      onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input
                      id="twitter_url"
                      value={settings.twitter_url || ""}
                      onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_url">Instagram URL</Label>
                    <Input
                      id="instagram_url"
                      value={settings.instagram_url || ""}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={settings.linkedin_url || ""}
                      onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
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
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary_color"
                        value={settings.primary_color || ""}
                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                        placeholder="#3b82f6"
                      />
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: settings.primary_color }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Allow users to switch themes</p>
                    </div>
                    <Switch
                      checked={settings.enable_dark_mode}
                      onCheckedChange={(checked) => setSettings({ ...settings, enable_dark_mode: checked })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default_theme">Default Theme</Label>
                    <Select
                      value={settings.default_theme}
                      onValueChange={(value) => setSettings({ ...settings, default_theme: value })}
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
                      checked={settings.enable_analytics}
                      onCheckedChange={(checked) => setSettings({ ...settings, enable_analytics: checked })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                    <Input
                      id="google_analytics_id"
                      value={settings.google_analytics_id}
                      onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
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
                    checked={settings.enable_email_notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, enable_email_notifications: checked })}
                  />
                </div>

                {settings.enable_email_notifications && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        value={settings.smtp_host}
                        onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        value={settings.smtp_port}
                        onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })}
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp_user">SMTP Username</Label>
                      <Input
                        id="smtp_user"
                        value={settings.smtp_user}
                        onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                        placeholder="your-email@gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp_password">SMTP Password</Label>
                      <Input
                        id="smtp_password"
                        type="password"
                        value={settings.smtp_password}
                        onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                        placeholder="Your email password"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </AdminLayout>
      </main>
      <Footer />
    </div>
  );
};

export default GlobalSettings;
