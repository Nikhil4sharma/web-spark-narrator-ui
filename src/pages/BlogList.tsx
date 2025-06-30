import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("status", "published").order("created_at", { ascending: false });
      setBlogs(data || []);
    })();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {blogs.map(blog => (
          <div key={blog.id} className="rounded-lg border shadow hover:shadow-lg transition cursor-pointer overflow-hidden bg-white" onClick={() => navigate(`/blog/${blog.slug}`)}>
            {blog.cover_image && <img src={blog.cover_image} alt={blog.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <div className="text-gray-500 text-sm mb-2">{new Date(blog.created_at).toLocaleDateString()}</div>
              <div className="line-clamp-3 mb-2" dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 200) + (blog.content.length > 200 ? '...' : '') }} />
              <div className="flex flex-wrap gap-2 mt-2">
                {blog.tags && blog.tags.map((tag: string) => <span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded">#{tag}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList; 