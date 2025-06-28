
import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GlobalSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: "WebStory Hub",
    siteDescription: "Discover amazing web stories",
    logoUrl: "",
    adsenseCode: "",
    analyticsCode: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your site settings have been updated successfully.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  return (
    <AdminLayout title="Global Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={settings.siteTitle}
                  onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                  placeholder="Your site title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Brief description of your site"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Site Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">Click to upload your site logo</p>
                <p className="text-xs text-gray-400 mt-2">Recommended: SVG or PNG, max 2MB</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Or enter logo URL</Label>
                <Input
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AdSense Integration */}
        <Card>
          <CardHeader>
            <CardTitle>AdSense Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adsenseCode">AdSense Publisher ID</Label>
              <Input
                id="adsenseCode"
                value={settings.adsenseCode}
                onChange={(e) => handleInputChange('adsenseCode', e.target.value)}
                placeholder="ca-pub-xxxxxxxxxxxxxxxx"
              />
              <p className="text-sm text-muted-foreground">
                Enter your Google AdSense publisher ID to enable ads on your stories.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analyticsCode">Google Analytics Tracking ID</Label>
              <Input
                id="analyticsCode"
                value={settings.analyticsCode}
                onChange={(e) => handleInputChange('analyticsCode', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-sm text-muted-foreground">
                Add your Google Analytics tracking ID to monitor site performance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/youraccount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/youraccount"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="robotsTxt">Custom robots.txt additions</Label>
              <Textarea
                id="robotsTxt"
                placeholder="Enter custom robots.txt directives"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Additional directives to include in your robots.txt file.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GlobalSettings;
