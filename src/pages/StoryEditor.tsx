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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

const defaultPage = () => ({
  id: Date.now().toString(),
  backgroundType: "image",
  backgroundUrl: "",
  backgroundAlt: "",
  elements: [], // overlays: text/image/video
});

// LivePreview component for real-time story preview
const LivePreview = ({ pages, selectedPageIdx, mode, onPageChange, onElementClick, selectedElementIdx, onElementDelete }: { pages: any[], selectedPageIdx: number, mode: 'edit' | 'preview', onPageChange?: (idx: number) => void, onElementClick?: (idx: number) => void, selectedElementIdx?: number, onElementDelete?: (idx: number) => void }) => {
  const page = pages[selectedPageIdx];
  if (!page) return null;
  return (
    <div className="relative w-[320px] h-[570px] bg-gradient-to-br from-white/80 to-gray-100/80 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center mx-auto">
      {/* Mobile notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-gray-300 rounded-full opacity-60 z-10" />
      {/* Background */}
      {page.backgroundType === 'image' && page.backgroundUrl && (
        <img src={page.backgroundUrl} alt={page.backgroundAlt || 'story background'} className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      {page.backgroundType === 'video' && page.backgroundUrl && (
        <video src={page.backgroundUrl} className="absolute inset-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline aria-label={page.backgroundAlt || 'story background video'} />
      )}
      {/* Overlays */}
      {page.elements.map((el: any, i: number) => {
        if (el.type === 'text') {
          const Tag = el.style?.fontType || 'h2';
          const isSelected = selectedElementIdx === i;
          return (
            <div key={el.id} className="absolute left-0 bottom-0 z-10 w-full flex justify-center">
              <div
                className={`backdrop-blur-sm`} style={{
                  background: 'rgba(0,0,0,0.10)',
                  borderTopLeftRadius: '1rem',
                  borderTopRightRadius: '1rem',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18), 0 0 32px 8px rgba(0,0,0,0.10)',
                  borderTop: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s',
                  position: 'relative',
                  ...(isSelected ? { transform: 'scale(1.05)' } : {}),
                  textAlign: el.style?.align || 'center',
                  color: el.style?.color || '#fff',
                  fontWeight: el.style?.fontWeight || 'bold',
                  fontStyle: el.style?.fontStyle || 'normal',
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                  fontSize: el.style?.fontSize || '2em',
                  letterSpacing: el.style?.letterSpacing || '0px',
                  lineHeight: el.style?.lineHeight || '1.2',
                  textShadow: '0 2px 8px #0008',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={e => { e.stopPropagation(); onElementClick && onElementClick(i); }}
              >
                <Tag>{el.value}</Tag>
                {/* Edit icon */}
                <button className="absolute top-2 right-10 bg-primary/80 text-white rounded-full p-1 shadow hover:bg-primary" onClick={e => { e.stopPropagation(); onElementClick && onElementClick(i); }} title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
                </button>
                {/* Delete icon */}
                <button className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 shadow hover:bg-red-600" onClick={e => { e.stopPropagation(); if (typeof onElementDelete === 'function') onElementDelete(i); }} title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}
      {/* Page indicator & navigation (preview mode) */}
      {mode === 'preview' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          <button disabled={selectedPageIdx === 0} onClick={() => onPageChange && onPageChange(selectedPageIdx - 1)} className="bg-white/70 hover:bg-white/90 rounded-full px-3 py-1 shadow disabled:opacity-40">◀</button>
          <span className="text-xs font-bold text-gray-700 bg-white/70 rounded-full px-3 py-1">Page {selectedPageIdx + 1} / {pages.length}</span>
          <button disabled={selectedPageIdx === pages.length - 1} onClick={() => onPageChange && onPageChange(selectedPageIdx + 1)} className="bg-white/70 hover:bg-white/90 rounded-full px-3 py-1 shadow disabled:opacity-40">▶</button>
        </div>
      )}
    </div>
  );
};

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
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [previewPageIdx, setPreviewPageIdx] = useState(0);

  // Fetch story data if editing
  const { data: story, isLoading: storyLoading } = useStory(id || "");
  const { data: categories = [] } = useCategories();
  const createStoryMutation = useCreateStory();
  const updateStoryMutation = useUpdateStory();

  // Track selected overlay for editing
  const [selectedElementIdx, setSelectedElementIdx] = useState<number | null>(null);

  // Helper: get selected element
  const selectedElement = selectedElementIdx !== null ? pages[selectedPageIdx].elements[selectedElementIdx] : null;

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
    if (type === "text") {
      const newElement = {
        id: Date.now().toString(),
        type,
        value: "New text",
        position: { x: 50, y: 50 },
        style: { fontSize: "2em", color: "#fff" },
      };
      setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, elements: [...p.elements, newElement] } : p));
    } else if (type === "image") {
      setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundType: type, backgroundUrl: '', backgroundAlt: '' } : p));
    } else if (type === "video") {
      setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundType: type, backgroundUrl: '', backgroundAlt: '' } : p));
    }
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

  // Update selected element's style
  const updateSelectedElementStyle = (changes: any) => {
    if (selectedElementIdx === null) return;
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.map((el, j) => j === selectedElementIdx ? { ...el, style: { ...el.style, ...changes } } : el)
    } : p));
  };

  // Update selected element's value
  const updateSelectedElementValue = (value: string) => {
    if (selectedElementIdx === null) return;
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.map((el, j) => j === selectedElementIdx ? { ...el, value } : el)
    } : p));
  };

  // Update selected element's font type
  const updateSelectedElementFontType = (fontType: string) => {
    if (selectedElementIdx === null) return;
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.map((el, j) => j === selectedElementIdx ? { ...el, style: { ...el.style, fontType } } : el)
    } : p));
  };

  // Update selected element's alignment
  const updateSelectedElementAlign = (align: string) => {
    if (selectedElementIdx === null) return;
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.map((el, j) => j === selectedElementIdx ? { ...el, style: { ...el.style, align } } : el)
    } : p));
  };

  // Update selected element's animation
  const updateSelectedElementAnimation = (animation: string) => {
    if (selectedElementIdx === null) return;
    setPages(pages.map((p, i) => i === selectedPageIdx ? {
      ...p,
      elements: p.elements.map((el, j) => j === selectedElementIdx ? { ...el, style: { ...el.style, animation } } : el)
    } : p));
  };

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

  // Add font options
  const FONT_FAMILIES = [
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
    { label: 'Lato', value: 'Lato, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Merriweather', value: 'Merriweather, serif' },
    { label: 'Oswald', value: 'Oswald, sans-serif' },
  ];

  // UI
  return (
    <AdminLayout title={isEditing ? "Edit Story" : "Create Story"}>
      <div className="flex flex-col md:flex-row gap-6 w-full min-h-[80vh]">
        {/* LEFT SIDEBAR: Metadata */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <Card className="bg-white/60 backdrop-blur-md shadow-xl border-0">
            <CardHeader>
              <CardTitle>Story Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="meta">
                <AccordionItem value="meta">
                  <AccordionTrigger>Basic Info</AccordionTrigger>
                  <AccordionContent>
                    {/* Title, Slug, Category, etc. */}
                    <div className="space-y-3">
                      <Label>Title</Label>
                      <Input value={meta.title} onChange={e => handleMetaChange('title', e.target.value)} placeholder="Story Title" />
                      <Label>Slug</Label>
                      <Input value={meta.slug} onChange={e => handleMetaChange('slug', e.target.value)} placeholder="story-title" />
                      <Label>Category</Label>
                      <Select value={meta.category} onValueChange={v => handleMetaChange('category', v)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: any) => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="seo">
                  <AccordionTrigger>SEO</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <Label>SEO Headline</Label>
                      <Input value={meta.seoHeadline} onChange={e => handleMetaChange('seoHeadline', e.target.value)} placeholder="SEO Headline" />
                      <Label>SEO Keywords</Label>
                      <Input value={meta.seoKeywords} onChange={e => handleMetaChange('seoKeywords', e.target.value)} placeholder="news, story, trending" />
                      <Label>Description</Label>
                      <Input value={meta.description} onChange={e => handleMetaChange('description', e.target.value)} placeholder="Short description" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="media">
                  <AccordionTrigger>Media</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <Label>Poster Image URL</Label>
                      <Input value={meta.posterPortrait} onChange={e => handleMetaChange('posterPortrait', e.target.value)} placeholder="https://..." />
                      <Label>Publisher Logo URL</Label>
                      <Input value={meta.publisherLogo} onChange={e => handleMetaChange('publisherLogo', e.target.value)} placeholder="https://..." />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </aside>

        {/* CENTER: Mobile Preview Canvas (moved up for bottom bar visibility) */}
        <section className="flex-1 flex flex-col items-center justify-start pt-4">
          <div className="relative w-[340px] h-[600px] bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center">
            <LivePreview 
              pages={pages} 
              selectedPageIdx={selectedPageIdx} 
              mode={previewTab} 
              onPageChange={setPreviewPageIdx}
              onElementClick={setSelectedElementIdx}
              selectedElementIdx={selectedElementIdx}
              onElementDelete={(idx) => {
                removeElement(idx);
                if (selectedElementIdx === idx) setSelectedElementIdx(null);
              }}
            />
          </div>
          {/* Add buttons below preview */}
          <div className="flex gap-4 mt-4 bg-white/60 rounded-2xl shadow p-4">
            <Button variant="secondary" onClick={() => { addElement('text'); setSelectedElementIdx(pages[selectedPageIdx].elements.length); }}>+ Text</Button>
            <Button variant="secondary" onClick={() => addElement('image')}>+ Image</Button>
            <Button variant="secondary" onClick={() => addElement('video')}>+ Video</Button>
          </div>
        </section>

        {/* RIGHT SIDEBAR: Style Controls (only if a text overlay is selected) */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <Card className="bg-white/60 backdrop-blur-md shadow-xl border-0">
            <CardHeader>
              <CardTitle>Style Controls</CardTitle>
            </CardHeader>
            <CardContent>
              {/* If background is image, show image URL and alt text fields */}
              {pages[selectedPageIdx].backgroundType === 'image' && (
                <div className="space-y-4 mb-6">
                  <Label>Image URL</Label>
                  <Input value={pages[selectedPageIdx].backgroundUrl} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundUrl: e.target.value } : p))} />
                  <Label>Alt Text</Label>
                  <Input value={pages[selectedPageIdx].backgroundAlt || ''} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundAlt: e.target.value } : p))} placeholder="Describe the image (SEO)" />
                </div>
              )}
              {/* If background is video, show video URL and description/caption fields */}
              {pages[selectedPageIdx].backgroundType === 'video' && (
                <div className="space-y-4 mb-6">
                  <Label>Video URL</Label>
                  <Input value={pages[selectedPageIdx].backgroundUrl} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundUrl: e.target.value } : p))} />
                  <Label>Description/Caption</Label>
                  <Input value={pages[selectedPageIdx].backgroundAlt || ''} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, backgroundAlt: e.target.value } : p))} placeholder="Describe the video (SEO/Accessibility)" />
                </div>
              )}
              {/* Overlay list for quick selection/removal */}
              {pages[selectedPageIdx].elements.length > 0 && (
                <div className="mb-4">
                  <Label>Overlays</Label>
                  <ul className="space-y-1">
                    {pages[selectedPageIdx].elements.map((el, idx) => (
                      <li key={el.id} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${selectedElementIdx === idx ? 'bg-primary/10' : 'hover:bg-muted/40'}`} onClick={() => setSelectedElementIdx(idx)}>
                        <span className="capitalize text-xs font-semibold">{el.type}</span>
                        <span className="truncate flex-1 text-xs">{el.value?.slice(0, 18) || el.url?.slice(0, 18) || ''}</span>
                        <button className="text-red-500 hover:text-red-700" onClick={e => { e.stopPropagation(); removeElement(idx); if (selectedElementIdx === idx) setSelectedElementIdx(null); }} title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedElement && selectedElement.type === 'text' ? (
                <div className="space-y-4">
                  <Label>Text</Label>
                  <Input value={selectedElement.value} onChange={e => updateSelectedElementValue(e.target.value)} />
                  <Label>Font Size</Label>
                  <Slider min={12} max={64} step={1} value={[parseInt(selectedElement.style?.fontSize || '24')]} onValueChange={([v]) => updateSelectedElementStyle({ fontSize: v + 'px' })} />
                  <Label>Color</Label>
                  <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent" value={selectedElement.style?.color || '#ffffff'} onChange={e => updateSelectedElementStyle({ color: e.target.value })} />
                  <Label>Alignment</Label>
                  <select className="w-full border rounded px-2 py-1" value={selectedElement.style?.align || 'center'} onChange={e => updateSelectedElementAlign(e.target.value)}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                  <div className="flex gap-2">
                    <Button type="button" variant={selectedElement.style?.fontWeight === 'bold' ? 'default' : 'outline'} size="sm" onClick={() => updateSelectedElementStyle({ fontWeight: selectedElement.style?.fontWeight === 'bold' ? 'normal' : 'bold' })}>B</Button>
                    <Button type="button" variant={selectedElement.style?.fontStyle === 'italic' ? 'default' : 'outline'} size="sm" onClick={() => updateSelectedElementStyle({ fontStyle: selectedElement.style?.fontStyle === 'italic' ? 'normal' : 'italic' })}><span style={{ fontStyle: 'italic' }}>I</span></Button>
                  </div>
                  <Label>Letter Spacing</Label>
                  <Slider min={-2} max={10} step={0.5} value={[parseFloat(selectedElement.style?.letterSpacing || '0')]} onValueChange={([v]) => updateSelectedElementStyle({ letterSpacing: v + 'px' })} />
                  <Label>Line Spacing</Label>
                  <Slider min={1} max={2.5} step={0.05} value={[parseFloat(selectedElement.style?.lineHeight || '1.2')]} onValueChange={([v]) => updateSelectedElementStyle({ lineHeight: v.toString() })} />
                  <Button variant="destructive" className="w-full" onClick={() => { removeElement(selectedElementIdx!); setSelectedElementIdx(null); }}>Delete This Overlay</Button>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Click a text card in preview or list to edit or delete.</div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* BOTTOM BAR: Page Navigation */}
      <div className="w-full flex items-center justify-center gap-4 mt-4">
        <Button variant="outline" onClick={() => removePage(selectedPageIdx)} disabled={pages.length === 1}>Remove Page</Button>
        <Button variant="outline" onClick={addPage}>Add Page</Button>
        <div className="flex gap-2">
          {pages.map((_, idx) => (
            <Button key={idx} size="icon" variant={idx === selectedPageIdx ? "default" : "ghost"} onClick={() => { selectPage(idx); setSelectedElementIdx(null); }}>{idx + 1}</Button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoryEditor;
