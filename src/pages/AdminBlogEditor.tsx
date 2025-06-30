import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const defaultBlog = {
  title: "",
  slug: "",
  content: "",
  cover_image: "",
  tags: [],
  status: "draft",
  author: "",
  seo_title: "",
  seo_description: "",
};

const AdminBlogEditor = () => {
  const [blog, setBlog] = useState(defaultBlog);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // TODO: If id, fetch blog for edit mode

  const handleChange = (field: string, value: any) => {
    setBlog((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (!blog.title || !blog.content) {
      toast({ title: "Title & Content required", variant: "destructive" });
      setIsSaving(false);
      return;
    }
    // Generate slug if not set
    const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = { ...blog, slug };
    let result;
    if (id) {
      result = await supabase.from("blog_posts").update(payload).eq("id", id);
    } else {
      result = await supabase.from("blog_posts").insert([payload]);
    }
    if (result.error) {
      toast({ title: "Error", description: result.error.message, variant: "destructive" });
    } else {
      toast({ title: "Blog saved!" });
      navigate("/admin/blogs");
    }
    setIsSaving(false);
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Blog Post" : "New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input value={blog.title} onChange={e => handleChange("title", e.target.value)} placeholder="Blog title" />
          </div>
          <div>
            <Label>Cover Image URL</Label>
            <Input value={blog.cover_image} onChange={e => handleChange("cover_image", e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input value={blog.tags.join(", ")} onChange={e => handleChange("tags", e.target.value.split(",").map(t => t.trim()))} placeholder="news, tech, life" />
          </div>
          <div>
            <Label>Status</Label>
            <select className="w-full border rounded px-2 py-1" value={blog.status} onChange={e => handleChange("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <Label>Content</Label>
            <ReactQuill theme="snow" value={blog.content} onChange={val => handleChange("content", val)} />
          </div>
          <div>
            <Label>SEO Title</Label>
            <Input value={blog.seo_title} onChange={e => handleChange("seo_title", e.target.value)} placeholder="SEO title (optional)" />
          </div>
          <div>
            <Label>SEO Description</Label>
            <Textarea value={blog.seo_description} onChange={e => handleChange("seo_description", e.target.value)} placeholder="SEO description (optional)" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate("/admin/blogs")}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Blog"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogEditor; 