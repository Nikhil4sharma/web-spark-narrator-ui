import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      setBlogs(data || []);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    setBlogs(blogs.filter(b => b.id !== id));
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => navigate("/admin/blogs/new")}>New Blog</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : blogs.length === 0 ? (
            <div>No blogs found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id} className="border-t">
                    <td className="py-2">{blog.title}</td>
                    <td>{blog.status}</td>
                    <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}>Edit</Button>
                      <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(blog.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogs; 