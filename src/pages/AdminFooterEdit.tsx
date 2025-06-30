import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/footer";

const defaultFooter = {
  brand: "Aaj ki Story",
  description: "Aaj ki Story: your ultimate news destination, delivering the latest and most reliable updates including automobiles, business, technology, finance, entertainment, education, and sports 🚀",
  facebook: "",
  whatsapp: "",
  instagram: "",
  youtube: "",
  copyright: "© 2025 Aaj ki Story. All rights reserved",
};

const AdminFooterEdit = () => {
  const [footer, setFooter] = useState(defaultFooter);
  const [footerId, setFooterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch footer settings from Supabase
  useEffect(() => {
    const fetchFooter = async () => {
      setIsLoading(true);
      setFetchError(null);
      const { data, error } = await supabase.from("footer_settings").select("*").limit(1).single();
      if (error) {
        setFetchError("Failed to fetch footer settings from Supabase.");
        setIsLoading(false);
        return;
      }
      setFooter({ ...defaultFooter, ...data });
      setFooterId(data.id);
      setIsLoading(false);
    };
    fetchFooter();
  }, []);

  // Save footer settings to Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!footerId) {
      toast({ title: "Error", description: "Footer settings ID not found.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const { error } = await supabase.from("footer_settings").update(footer).eq("id", footerId);
    if (error) {
      toast({ title: "Error", description: "Failed to update footer settings.", variant: "destructive" });
    } else {
      toast({ title: "Footer updated", description: "Footer content updated successfully." });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <AdminLayout title="Edit Footer">
          <div className="max-w-2xl mx-auto py-8">
            <Card>
              <CardHeader>
                <CardTitle>Edit Footer Content</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <Label htmlFor="brand">Brand Name</Label>
                    <Input id="brand" value={footer.brand} onChange={e => setFooter({ ...footer, brand: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={footer.description} onChange={e => setFooter({ ...footer, description: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input id="facebook" value={footer.facebook} onChange={e => setFooter({ ...footer, facebook: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp URL</Label>
                    <Input id="whatsapp" value={footer.whatsapp} onChange={e => setFooter({ ...footer, whatsapp: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input id="instagram" value={footer.instagram} onChange={e => setFooter({ ...footer, instagram: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube URL</Label>
                    <Input id="youtube" value={footer.youtube} onChange={e => setFooter({ ...footer, youtube: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="copyright">Copyright</Label>
                    <Input id="copyright" value={footer.copyright} onChange={e => setFooter({ ...footer, copyright: e.target.value })} required />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Footer"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </AdminLayout>
      </main>
      <Footer />
    </div>
  );
};

export default AdminFooterEdit; 