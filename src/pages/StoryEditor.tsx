import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Save, Image, Video, Trash2, ArrowLeft, Loader2, Tag, Calendar, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStory, useCreateStory, useUpdateStory } from "@/hooks/use-stories";
import { useCategories } from "@/hooks/use-categories";
import { CreateStoryRequest } from "@/lib/api";

const StoryEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState("basic");
  const [storyData, setStoryData] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    category: "",
    coverImage: "",
    duration: "auto",
    animationType: "fade",
  });

  const [pages, setPages] = useState([
    {
      id: "1",
      layers: [
        { id: "1", type: "text", content: "Welcome to our story", position: { x: 50, y: 50 } },
      ],
    },
  ]);

  const googleFonts = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Source Sans Pro"
  ];

  const animationTypes = [
    { value: "fade", label: "Fade" },
    { value: "slide", label: "Slide" },
    { value: "zoom", label: "Zoom" },
    { value: "flip", label: "Flip" },
  ];

  const [formData, setFormData] = useState<CreateStoryRequest>({
    title: "",
    content: "",
    category: "",
    coverImage: "",
    tags: [],
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch story data if editing
  const { data: story, isLoading: storyLoading } = useStory(id || "");
  const { data: categories = [] } = useCategories();
  const createStoryMutation = useCreateStory();
  const updateStoryMutation = useUpdateStory();

  // Load story data when editing
  useEffect(() => {
    if (story && isEditing) {
      setFormData({
        title: story.title,
        content: story.content,
        category: story.category,
        coverImage: story.coverImage,
        tags: story.tags,
        status: story.status,
      });
    }
  }, [story, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing && story) {
        await updateStoryMutation.mutateAsync({
          id: story.id,
          ...formData,
        });
        toast({
          title: "Story updated",
          description: `"${formData.title}" has been updated successfully.`,
        });
      } else {
        await createStoryMutation.mutateAsync(formData);
        toast({
          title: "Story created",
          description: `"${formData.title}" has been created successfully.`,
        });
      }
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} story. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const addPage = () => {
    const newPage = {
      id: Date.now().toString(),
      layers: [],
    };
    setPages([...pages, newPage]);
  };

  const addLayer = (pageId: string, type: "text" | "image" | "video") => {
    setPages(pages.map(page => {
      if (page.id === pageId) {
        const newLayer = {
          id: Date.now().toString(),
          type,
          content: type === "text" ? "New text layer" : "",
          position: { x: 25, y: 25 },
        };
        return { ...page, layers: [...page.layers, newLayer] };
      }
      return page;
    }));
  };

  if (storyLoading && isEditing) {
    return (
      <AdminLayout title="Loading Story...">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? "Edit Story" : "Create New Story"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{isEditing ? "Edit Story" : "Create New Story"}</h2>
              <p className="text-muted-foreground">
                {isEditing ? "Update your story content and settings" : "Write and publish your next great story"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || createStoryMutation.isPending || updateStoryMutation.isPending}
            >
              {(isLoading || createStoryMutation.isPending || updateStoryMutation.isPending) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? "Update Story" : "Create Story"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Story Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter your story title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-lg font-medium"
                  required
                />
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Story Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your story content here... Use markdown for formatting."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[400px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supports markdown formatting. Use **bold**, *italic*, [links](url), etc.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter image URL..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                />
                {formData.coverImage && (
                  <div className="aspect-[3/4] overflow-hidden rounded-md border">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Story Info */}
            {isEditing && story && (
              <Card>
                <CardHeader>
                  <CardTitle>Story Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Author:</span>
                    <span className="ml-2">{story.author}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2">{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Views:</span>
                    <span className="ml-2">{story.views.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default StoryEditor;
