
import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Save, Image, Video, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const StoryEditor = () => {
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

  const handleSave = (isDraft = true) => {
    toast({
      title: isDraft ? "Draft Saved" : "Story Published",
      description: `Your story has been ${isDraft ? "saved as draft" : "published"} successfully.`,
    });
  };

  return (
    <AdminLayout title="Story Editor">
      <div className="max-w-6xl mx-auto">
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Step 1: Basic Info</TabsTrigger>
            <TabsTrigger value="media">Step 2: Media & Category</TabsTrigger>
            <TabsTrigger value="pages">Step 3: Page Editor</TabsTrigger>
          </TabsList>

          {/* Step 1: Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Story Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter story title"
                      value={storyData.title}
                      onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      placeholder="story-url-slug"
                      value={storyData.slug}
                      onChange={(e) => setStoryData({ ...storyData, slug: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta">Meta Description (SEO)</Label>
                  <Textarea
                    id="meta"
                    placeholder="Brief description for search engines"
                    value={storyData.metaDescription}
                    onChange={(e) => setStoryData({ ...storyData, metaDescription: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Media & Category */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cover Image & Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Cover Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">Click to upload cover image</p>
                      <p className="text-xs text-gray-400 mt-2">Recommended: 720x1280px</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={storyData.category} onValueChange={(value) => setStoryData({ ...storyData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Story Duration</Label>
                      <Select value={storyData.duration} onValueChange={(value) => setStoryData({ ...storyData, duration: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="5s">5 seconds</SelectItem>
                          <SelectItem value="10s">10 seconds</SelectItem>
                          <SelectItem value="15s">15 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="animation">Animation Type</Label>
                      <Select value={storyData.animationType} onValueChange={(value) => setStoryData({ ...storyData, animationType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {animationTypes.map((animation) => (
                            <SelectItem key={animation.value} value={animation.value}>
                              {animation.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Page Editor */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Story Pages</h3>
              <Button onClick={addPage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pages List */}
              <div className="space-y-4">
                <h4 className="font-medium">Pages ({pages.length})</h4>
                {pages.map((page, index) => (
                  <Card key={page.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Page {index + 1}</span>
                        <Badge variant="secondary">{page.layers.length} layers</Badge>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => addLayer(page.id, "text")}>
                          <Plus className="w-3 h-3 mr-1" />
                          Text
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addLayer(page.id, "image")}>
                          <Image className="w-3 h-3 mr-1" />
                          Image
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addLayer(page.id, "video")}>
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Page Editor */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Eye className="w-8 h-8 mx-auto mb-2" />
                          <p>Page Preview</p>
                          <p className="text-sm">Add layers to see content</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Text Formatting Options */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Text Formatting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {googleFonts.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                            <SelectItem value="xl">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Alignment</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Align" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-black rounded border cursor-pointer"></div>
                          <div className="w-8 h-8 bg-white border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => handleSave(true)}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave(false)}>
              Publish Story
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoryEditor;
