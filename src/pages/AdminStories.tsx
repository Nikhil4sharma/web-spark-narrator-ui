import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/use-categories";
import { useStories, useDeleteStory } from "@/hooks/use-stories";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Footer from "@/components/footer";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const AdminStories = () => {
  const [tab, setTab] = useState("stories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // TODO: If subcategories exist, add subcategory state
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: storiesData = { stories: [], total: 0 }, isLoading: storiesLoading } = useStories({
    category: selectedCategory || undefined,
    type: tab === "blog" ? "blog" : "story", // If you have a type field
  });
  const navigate = useNavigate();
  const deleteStoryMutation = useDeleteStory();

  const handleDelete = async (storyId: string) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      const { error } = await supabase.from("web_stories").delete().eq("id", storyId);
      if (error) throw error;
      toast.success("Story deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete story. Please try again.");
    }
  };

  // TODO: Add subcategory logic if subcategories table exists

  return (
    <AdminLayout title="Stories Management">
      <div className="space-y-6">
        {/* Tabs for Stories/Blog Posts */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="w-full">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.name)}
                  size="sm"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            {/* TODO: Subcategory Tabs if needed */}
            {/* Stories/Blogs List */}
            <div className="flex justify-end mb-4">
              <Button asChild>
                <Link to="/admin/story/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add {tab === "blog" ? "Blog Post" : "Story"}
                </Link>
              </Button>
            </div>
            {storiesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : storiesData.stories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No {tab === "blog" ? "blog posts" : "stories"} found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storiesData.stories.map((story) => (
                  <Card key={story.id} className="group hover:shadow-lg transition cursor-pointer">
                    <CardHeader>
                      <CardTitle className="truncate">{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-xs text-muted-foreground truncate">{story.category}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/story/edit/${story.id}`)}>
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(story.id)} disabled={deleteStoryMutation.isPending}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </AdminLayout>
  );
};

export default AdminStories; 