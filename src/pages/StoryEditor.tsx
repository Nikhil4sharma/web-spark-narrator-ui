import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Save, Image, Video, Trash2, ArrowLeft, Loader2, Info, Tag, Calendar, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStory, useCreateStory, useUpdateStory } from "@/hooks/use-stories";
import { useCategories } from "@/hooks/use-categories";
import Footer from "@/components/footer";

const defaultPage = () => ({
  id: Date.now().toString(),
  backgroundType: "image",
  backgroundUrl: "",
  elements: [], // overlays: text/image/video
});

const StoryEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Story metadata
  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    description: "",
    publisher: "",
    publisherLogo: "",
    posterPortrait: "",
    author: "",
    seoHeadline: "",
    seoKeywords: "",
    canonicalUrl: "",
    status: "draft",
    category: "",
  });

  // Pages array
  const [pages, setPages] = useState([defaultPage()]);
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch story data if editing
  const { data: story, isLoading: storyLoading } = useStory(id || "");
  const { data: categories = [] } = useCategories();
  const createStoryMutation = useCreateStory();
  const updateStoryMutation = useUpdateStory();

  // Load story data when editing
  useEffect(() => {
    if (story && isEditing) {
      setMeta({
        title: story.title,
        slug: story.slug,
        description: story.description,
        publisher: story.publisher,
        publisherLogo: story.publisher_logo_url,
        posterPortrait: story.poster_portrait_url,
        author: story.author,
        seoHeadline: story.seo_headline,
        seoKeywords: story.seo_keywords?.join(", ") || "",
        canonicalUrl: story.canonical_url,
        status: story.status,
        category: story.category,
      });
      setPages(story.pages || [defaultPage()]);
    }
  }, [story, isEditing]);

  // Add new page
  const addPage = () => setPages([...pages, defaultPage()]);
  // Remove page
  const removePage = (idx: number) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, i) => i !== idx);
    setPages(newPages);
    setSelectedPageIdx(Math.max(0, selectedPageIdx - (idx === selectedPageIdx ? 1 : 0)));
  };
  // Select page
  const selectPage = (idx: number) => setSelectedPageIdx(idx);

  // Add overlay/element to page
  const addElement = (type: "text" | "image" | "video") => {
    const newElement = {
      id: Date.now().toString(),
      type,
      value: type === "text" ? "New text" : "",
      url: type !== "text" ? "" : undefined,
      position: { x: 50, y: 50 },
      style: { fontSize: "2em", color: "#fff" },
    };
    setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, elements: [...p.elements, newElement] } : p));
  };

  // Update element in page
  const updateElement = (elIdx: number, changes: any) => {
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.map((el, j) => j === elIdx ? { ...el, ...changes } : el)
    } : p));
  };

  // Remove element from page
  const removeElement = (elIdx: number) => {
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.filter((_, j) => j !== elIdx)
    } : p));
  };

  // Handle metadata change
  const handleMetaChange = (field: string, value: string) => setMeta({ ...meta, [field]: value });

  // Save/Publish story
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      ...meta,
      seoKeywords: meta.seoKeywords.split(",").map(k => k.trim()),
      pages,
    };
    try {
      if (isEditing && story) {
        await updateStoryMutation.mutateAsync({ id: story.id, ...payload });
        toast({ title: "Story updated", description: `"${meta.title}" has been updated successfully.` });
      } else {
        await createStoryMutation.mutateAsync(payload);
        toast({ title: "Story created", description: `"${meta.title}" has been created successfully.` });
      }
      navigate("/admin/dashboard");
    } catch (error) {
      toast({ title: "Error", description: `Failed to ${isEditing ? 'update' : 'create'} story. Please try again.`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Tooltip helper
  const InfoTip = ({ text }: { text: string }) => (
    <Tooltip content={text}>
      <Info className="inline w-4 h-4 ml-1 text-muted-foreground cursor-help" />
    </Tooltip>
  );

  // UI
  return (
    <AdminLayout title={isEditing ? "Edit Web Story" : "Create New Web Story"}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Metadata */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Title
                <InfoTip text="Story ka main title. Google Discover aur SEO ke liye important hai." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input required placeholder="Enter story title..." value={meta.title} onChange={e => handleMetaChange("title", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Slug
                <InfoTip text="URL slug (e.g. /stories/my-awesome-story). SEO friendly aur unique hona chahiye." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input required placeholder="Enter unique slug..." value={meta.slug} onChange={e => handleMetaChange("slug", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Poster Image
                <InfoTip text="Vertical cover image (min 640px width, 3:4 ya 4:3 aspect ratio). Google Discover pe yahi dikhegi." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input required placeholder="Poster image URL..." value={meta.posterPortrait} onChange={e => handleMetaChange("posterPortrait", e.target.value)} />
              {meta.posterPortrait && <img src={meta.posterPortrait} alt="Poster preview" className="mt-2 w-full aspect-[3/4] object-cover rounded" />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Publisher Name
                <InfoTip text="Brand ya publisher ka naam. AMP story mein dikhega." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input required placeholder="Publisher name..." value={meta.publisher} onChange={e => handleMetaChange("publisher", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Publisher Logo
                <InfoTip text="Square logo (min 96x96px, 1:1 ratio). AMP aur Google Discover ke liye zaroori." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input required placeholder="Logo image URL..." value={meta.publisherLogo} onChange={e => handleMetaChange("publisherLogo", e.target.value)} />
              {meta.publisherLogo && <img src={meta.publisherLogo} alt="Logo preview" className="mt-2 w-16 h-16 object-cover rounded-full" />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Author
                <InfoTip text="Story ka author ya creator." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Author name..." value={meta.author} onChange={e => handleMetaChange("author", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                SEO Headline
                <InfoTip text="Google search results mein dikhne wala headline. Short aur catchy rakho." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="SEO headline..." value={meta.seoHeadline} onChange={e => handleMetaChange("seoHeadline", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                SEO Keywords
                <InfoTip text="Comma separated keywords. SEO ranking mein help karte hain." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="e.g. health, breakfast, recipes" value={meta.seoKeywords} onChange={e => handleMetaChange("seoKeywords", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Canonical URL
                <InfoTip text="Original ya preferred URL. AMP story mein zaroori hai." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Canonical URL..." value={meta.canonicalUrl} onChange={e => handleMetaChange("canonicalUrl", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Category
                <InfoTip text="Story ki category. Discoverability ke liye." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={meta.category} onValueChange={v => handleMetaChange("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Status
                <InfoTip text="Draft ya published. Published stories hi website pe dikhenge." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={meta.status} onValueChange={v => handleMetaChange("status", v)}>
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
          <Button type="submit" className="w-full" disabled={isLoading || createStoryMutation.isPending || updateStoryMutation.isPending}>
            {(isLoading || createStoryMutation.isPending || updateStoryMutation.isPending) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? "Update Story" : "Create Story"}
          </Button>
        </form>
        {/* Main: Pages Builder */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Pages
              <InfoTip text="Har story mein multiple pages ho sakte hain. Har page ek screen hai (jaise Instagram story)." />
            </h2>
            <Button variant="outline" onClick={addPage}><Plus className="w-4 h-4 mr-2" /> Add Page</Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pages.map((page, idx) => (
              <div key={page.id} className={`border rounded p-2 min-w-[80px] cursor-pointer ${selectedPageIdx === idx ? 'border-primary' : 'border-muted'}`}
                onClick={() => selectPage(idx)}>
                <div className="flex items-center justify-between">
                  <span>Page {idx + 1}</span>
                  {pages.length > 1 && <Trash2 className="w-4 h-4 ml-2 text-destructive" onClick={e => { e.stopPropagation(); removePage(idx); }} />}
                </div>
              </div>
            ))}
          </div>
          {/* Page Editor */}
          <Card>
            <CardHeader>
              <CardTitle>
                Page Editor
                <InfoTip text="Yahan se har page ka background aur overlays set karo. Drag-and-drop aur live preview aayega." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Background Type */}
              <div className="mb-4">
                <Label>Background Type <InfoTip text="Image ya video background choose karo." /></Label>
                <Select value={pages[selectedPageIdx].backgroundType} onValueChange={v => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundType: v } : p))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <Label>Background URL <InfoTip text="Image ya video ka direct URL daalo." /></Label>
                <Input value={pages[selectedPageIdx].backgroundUrl} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundUrl: e.target.value } : p))} placeholder="https://..." />
                {pages[selectedPageIdx].backgroundUrl && (
                  pages[selectedPageIdx].backgroundType === "image" ?
                    <img src={pages[selectedPageIdx].backgroundUrl} alt="bg preview" className="mt-2 w-full aspect-[9/16] object-cover rounded" /> :
                    <video src={pages[selectedPageIdx].backgroundUrl} controls className="mt-2 w-full aspect-[9/16] object-cover rounded" />
                )}
              </div>
              {/* Overlays/Elements */}
              <div className="mb-4">
                <Label>Overlays/Elements <InfoTip text="Text, image, ya video overlays add karo. Drag-and-drop support coming soon!" /></Label>
                <div className="flex gap-2 mb-2">
                  <Button type="button" variant="outline" onClick={() => addElement("text")}>Text</Button>
                  <Button type="button" variant="outline" onClick={() => addElement("image")}>Image</Button>
                  <Button type="button" variant="outline" onClick={() => addElement("video")}>Video</Button>
                </div>
                {pages[selectedPageIdx].elements.length === 0 && <div className="text-muted-foreground text-sm">No overlays yet.</div>}
                {pages[selectedPageIdx].elements.map((el, elIdx) => (
                  <div key={el.id} className="border rounded p-2 mb-2 flex items-center gap-2">
                    <span className="capitalize">{el.type}</span>
                    {el.type === "text" ? (
                      <Input value={el.value} onChange={e => updateElement(elIdx, { value: e.target.value })} className="flex-1" placeholder="Text..." />
                    ) : (
                      <Input value={el.url} onChange={e => updateElement(elIdx, { url: e.target.value })} className="flex-1" placeholder={el.type === "image" ? "Image URL..." : "Video URL..."} />
                    )}
                    <Button type="button" variant="ghost" onClick={() => removeElement(elIdx)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
              {/* TODO: Drag-and-drop, position, style controls, live preview for overlays */}
              <div className="text-xs text-muted-foreground">Drag-and-drop overlays coming soon! Abhi manually text/image/video add karo.</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </AdminLayout>
  );
};

export default StoryEditor;
