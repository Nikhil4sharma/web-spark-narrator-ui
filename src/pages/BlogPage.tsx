import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const BlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
      setBlog(data);
      if (data && data.seo_title) document.title = data.seo_title;
      if (data && data.seo_description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', data.seo_description);
        else {
          const m = document.createElement('meta');
          m.name = 'description';
          m.content = data.seo_description;
          document.head.appendChild(m);
        }
      }
    })();
  }, [slug]);

  if (!blog) return <div className="container mx-auto py-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      {blog.cover_image && <img src={blog.cover_image} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-500 text-sm mb-4">{new Date(blog.created_at).toLocaleDateString()}</div>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      <div className="flex flex-wrap gap-2 mt-6">
        {blog.tags && blog.tags.map((tag: string) => <span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded">#{tag}</span>)}
      </div>
    </div>
  );
};

export default BlogPage; 