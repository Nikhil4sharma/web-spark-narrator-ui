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
import { useStoryById, useCreateStory, useUpdateStory } from "@/hooks/use-stories";
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
  cta: {
    text: "",
    url: "",
    bgColor: "#e11d48",
    textColor: "#fff",
  },
});

// LivePreview component for real-time story preview
const LivePreview = ({ pages, selectedPageIdx, mode, onPageChange, onElementClick, selectedElementIdx, onElementDelete, meta }: { pages: any[], selectedPageIdx: number, mode: 'edit' | 'preview', onPageChange?: (idx: number) => void, onElementClick?: (idx: number) => void, selectedElementIdx?: number, onElementDelete?: (idx: number) => void, meta: any }) => {
  const page = pages[selectedPageIdx];
  if (!page) return null;
  return (
    <div className="relative w-[320px] h-[570px] bg-black overflow-hidden flex flex-col items-center justify-center mx-auto">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full flex gap-1 px-6 pt-4 z-30">
        {pages.map((_, idx) => (
          <div key={idx} className={`flex-1 h-1 rounded-full transition-all duration-300 ${idx <= selectedPageIdx ? 'bg-white' : 'bg-gray-400/50'}`}></div>
        ))}
      </div>
      {/* Publisher logo + title */}
      {meta.publisherLogo && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <img src={meta.publisherLogo} alt="Publisher Logo" className="w-12 h-12 object-contain rounded-full bg-white/90 shadow" />
          <div className="text-center mt-1">
            <span className="block text-lg font-bold text-red-600 leading-none">Aaj ki</span>
            <span className="block text-base font-semibold text-neutral-900 leading-none">Story</span>
          </div>
        </div>
      )}
      {/* Background */}
      {page.backgroundType === 'image' && page.backgroundUrl && (
        <img src={page.backgroundUrl} alt={page.backgroundAlt || 'story background'} className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      {page.backgroundType === 'video' && page.backgroundUrl && (
        <video src={page.backgroundUrl} className="absolute inset-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline aria-label={page.backgroundAlt || 'story background video'} />
      )}
      {/* Gradient Overlay for text readability */}
      <div className="story-gradient" style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '40%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.10) 80%, transparent 100%)',
        zIndex: 2,
      }}></div>
      {/* Text Card (bottom) */}
      {page.elements.map((el: any) => {
        if (el.type === 'text') {
          return (
            <div key={el.id} className="story-text-card" style={{zIndex: 3, position: 'absolute', left: 0, bottom: page.cta && page.cta.text ? '72px' : '0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', textAlign: 'center', padding: '1.25rem 1.5rem', fontWeight: 500, textShadow: '0 2px 8px #0008'}}>
              {/* Glassmorphism Blur Only Behind Text */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(20,20,20,0.35)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderTopLeftRadius: '18px',
                borderTopRightRadius: '18px',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                zIndex: 0,
              }} />
              <div style={{position: 'relative', zIndex: 1, width: '100%'}}>
                {el.blocks.map((block: any) => {
                  const Tag = block.tag;
                  return (
                    <Tag
                      key={block.id}
                      style={{
                        textAlign: block.style?.align || 'center',
                        color: block.style?.color || '#fff',
                        fontWeight: block.style?.fontWeight || 'bold',
                        fontStyle: block.style?.fontStyle || 'normal',
                        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                        fontSize: block.style?.fontSize || (block.tag === 'h1' ? '2em' : block.tag === 'h2' ? '1.5em' : block.tag === 'h3' ? '1.2em' : '1em'),
                        letterSpacing: block.style?.letterSpacing || '0px',
                        lineHeight: block.style?.lineHeight || '1.2',
                        margin: 0,
                        padding: 0,
                        textShadow: '0 2px 8px #0008',
                      }}
                    >
                      {block.value}
                    </Tag>
                  );
                })}
                {/* Image Credit (optional) */}
                {page.backgroundCredit && (
                  <div className="text-xs mt-2 opacity-80">Image Credit: {page.backgroundCredit}</div>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
      {/* CTA Button at the very bottom, with margin */}
      {page.cta && page.cta.text && page.cta.url && (
        <a
          href={page.cta.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '24px',
            transform: 'translateX(-50%)',
            width: '80%',
            background: page.cta.bgColor || '#e11d48',
            color: page.cta.textColor || '#fff',
            borderRadius: '999px',
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
            textAlign: 'center',
            zIndex: 10,
            textDecoration: 'none',
            letterSpacing: '0.5px',
            transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
          }}
        >
          {page.cta.text}
        </a>
      )}
      {/* Page indicator & navigation (preview mode) */}
      {mode === 'preview' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          <button disabled={selectedPageIdx === 0} onClick={() => onPageChange && onPageChange(selectedPageIdx - 1)} className="bg-white/70 hover:bg-white/90 rounded-full px-3 py-1 shadow disabled:opacity-40">◀</button>
          <span className="text-xs font-bold text-gray-700 bg-white/70 rounded-full px-3 py-1">Page {selectedPageIdx + 1} / {pages.length}</span>
          <button disabled={selectedPageIdx === pages.length - 1} onClick={() => { onPageChange && onPageChange(selectedPageIdx + 1); }} className="bg-white/70 hover:bg-white/90 rounded-full px-3 py-1 shadow disabled:opacity-40">▶</button>
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
    publisherName: "",
    publisherLogo: "",
    publisherLogoAlt: "",
    posterPortrait: "",
    posterAlt: "",
    author: "",
    seoHeadline: "",
    seoKeywords: "",
    canonicalUrl: "",
    status: "draft",
    category: "",
    publishDate: "",
    updateDate: "",
  });

  // Pages array
  const [pages, setPages] = useState([defaultPage()]);
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [previewPageIdx, setPreviewPageIdx] = useState(0);

  // Fetch story data if editing
  const { data: story, isLoading: storyLoading } = useStoryById(id || "");
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
        description: '',
        publisher: '',
        publisherName: story.publisherName,
        publisherLogo: '',
        publisherLogoAlt: story.publisherLogoAlt,
        posterPortrait: '',
        posterAlt: story.posterAlt,
        author: story.author,
        seoHeadline: '',
        seoKeywords: story.tags?.join(", ") || "",
        canonicalUrl: story.canonicalUrl,
        status: story.status,
        category: story.category,
        publishDate: story.publishDate,
        updateDate: story.updateDate,
      });
      // Normalize pages: add cta if missing
      let loadedPages = story.content ? JSON.parse(story.content) : [defaultPage()];
      loadedPages = loadedPages.map((p: any) => ({
        ...p,
        cta: p.cta || { text: '', url: '', bgColor: '#e11d48', textColor: '#fff' },
        elements: p.elements || [],
      }));
      setPages(loadedPages);
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
        blocks: [
          {
            id: Date.now().toString() + '-block',
            tag: 'h1',
            value: 'New Heading',
            style: { fontSize: '2em', color: '#fff', fontWeight: 'bold', fontStyle: 'normal', letterSpacing: '0px', lineHeight: '1.2', align: 'center' },
          },
        ],
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

  // Helper to clean date fields
  const cleanDate = (d: string) => d && d.trim() ? d : null;

  // Save/Publish story
  const handleSubmit = async (e: React.FormEvent, forceStatus?: 'draft' | 'published') => {
    if (e) e.preventDefault();
    setIsLoading(true);
    let status = forceStatus || meta.status;
    let publishDate = cleanDate(meta.publishDate);
    let updateDate = cleanDate(meta.updateDate);
    if (status === 'published' && !publishDate) {
      publishDate = new Date().toISOString().slice(0, 10);
    }
    const allowedFields = [
      'title', 'slug', 'content', 'category', 'coverImage', 'status', 'author', 'tags', 'reading_time',
      'publisherName', 'publisherLogoAlt', 'posterAlt', 'publishDate', 'updateDate', 'canonicalUrl'
    ];
    const payloadRaw = {
      ...meta,
      title: meta.title && meta.title.trim() ? meta.title : 'Untitled Story',
      category: meta.category && meta.category.trim() ? meta.category : 'General',
      status,
      publishDate,
      updateDate,
      coverImage: meta.posterPortrait,
      tags: Array.isArray(meta.seoKeywords) ? meta.seoKeywords : meta.seoKeywords.split(',').map(k => k.trim()).filter(Boolean),
      publisherName: meta.publisherName,
      publisherLogoAlt: meta.publisherLogoAlt,
      posterAlt: meta.posterAlt,
      canonicalUrl: meta.canonicalUrl,
      content: JSON.stringify(pages),
    };
    const payload = Object.fromEntries(Object.entries(payloadRaw).filter(([k, v]) => allowedFields.includes(k) && (v !== '' && v !== undefined)));
    try {
      if (isEditing && story) {
        await updateStoryMutation.mutateAsync({ id: story.id, ...payload });
        toast({ title: status === 'published' ? 'Story published' : 'Draft saved', description: `"${meta.title}" has been updated successfully.` });
      } else {
        await createStoryMutation.mutateAsync(payload);
        toast({ title: status === 'published' ? 'Story published' : 'Draft saved', description: `"${meta.title}" has been created successfully.` });
      }
      if (status === 'published') navigate("/admin/dashboard");
    } catch (error) {
      toast({ title: "Error", description: `Failed to ${isEditing ? 'update' : 'create'} story. Please try again.`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Replace InfoTip with a custom tooltip that shows the usecase text on hover/focus, and displays a question mark icon
  const InfoTip = ({ text }: { text: string }) => (
    <span className="relative inline-block align-middle ml-1">
      <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-bold cursor-help border border-gray-300" tabIndex={0}>
        ?
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-black text-white text-xs rounded shadow-lg px-2 py-1 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity" style={{top: '100%'}}>
        {text}
      </span>
    </span>
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

  // Add state: selectedBlockIdx
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number | null>(0);

  // Add state: animatePage
  const [animatePage, setAnimatePage] = useState(false);

  // Draft auto-save: useEffect debounce
  useEffect(() => {
    if (!isEditing || meta.status === 'published') return;
    const timeout = setTimeout(() => {
      handleSubmit(undefined as any, 'draft');
    }, 1500);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, pages]);

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
                      <Label>Publisher Name <InfoTip text="Google Discover/AMP me publisher ke naam ke liye. Brand/website ka naam daalein." /></Label>
                      <Input value={meta.publisherName} onChange={e => handleMetaChange('publisherName', e.target.value)} placeholder="Aapke Brand ka Naam" />
                      <Label>Publisher Logo Alt <InfoTip text="Logo image ka alt text. Accessibility aur SEO ke liye zaroori." /></Label>
                      <Input value={meta.publisherLogoAlt} onChange={e => handleMetaChange('publisherLogoAlt', e.target.value)} placeholder="Logo ka description" />
                      <Label>Poster Image Alt <InfoTip text="Story ki cover image ka alt text. Google ko samjhane ke liye image kis cheez ki hai." /></Label>
                      <Input value={meta.posterAlt} onChange={e => handleMetaChange('posterAlt', e.target.value)} placeholder="Cover image ka description" />
                      <Label>Publish Date <InfoTip text="Story ki publish date. Google Discover me dikhane ke liye zaroori." /></Label>
                      <Input type="date" value={meta.publishDate} onChange={e => handleMetaChange('publishDate', e.target.value)} />
                      <Label>Update Date <InfoTip text="Story last update hui kab. AMP/SEO ke liye zaroori." /></Label>
                      <Input type="date" value={meta.updateDate} onChange={e => handleMetaChange('updateDate', e.target.value)} />
                      <Label>Canonical URL <InfoTip text="Original story ka URL. AMP/Discover me duplicate content avoid karne ke liye." /></Label>
                      <Input value={meta.canonicalUrl} onChange={e => handleMetaChange('canonicalUrl', e.target.value)} placeholder="https://aapkiwebsite.com/stories/slug" />
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
            {/* Publisher logo + 'Aaj ki' (red) + 'Story' (black/gray) at top center, below the notch, above the story content */}
            {meta.publisherLogo && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                <img src={meta.publisherLogo} alt="Publisher Logo" className="w-12 h-12 object-contain rounded-full bg-white/90 shadow" />
                <div className="text-center mt-1">
                  <span className="block text-lg font-bold text-red-600 leading-none">Aaj ki</span>
                  <span className="block text-base font-semibold text-neutral-900 leading-none">Story</span>
                </div>
              </div>
            )}
            <div className={`relative w-[320px] h-[570px] ... ${animatePage ? 'animate-fade-slide' : ''}`}>
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
                meta={meta}
              />
            </div>
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
                  <Label>Blocks</Label>
                  <ul className="space-y-1">
                    {selectedElement.blocks.map((block, idx) => (
                      <li key={block.id} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${selectedBlockIdx === idx ? 'bg-primary/10' : 'hover:bg-muted/40'}`} onClick={() => setSelectedBlockIdx(idx)}>
                        <span className="capitalize text-xs font-semibold">{block.tag.toUpperCase()}</span>
                        <span className="truncate flex-1 text-xs">{block.value?.slice(0, 18)}</span>
                        <button className="text-red-500 hover:text-red-700" onClick={e => { e.stopPropagation(); const newBlocks = selectedElement.blocks.filter((_, bIdx) => bIdx !== idx); updateElement(selectedElementIdx!, { blocks: newBlocks }); setSelectedBlockIdx(0); }} title="Delete Block">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mb-2">
                    <Button type="button" size="sm" onClick={() => { const newBlock = { id: Date.now().toString() + '-block', tag: 'h1', value: 'Heading', style: { fontSize: '2em', color: '#fff', fontWeight: 'bold', fontStyle: 'normal', letterSpacing: '0px', lineHeight: '1.2', align: 'center' } }; updateElement(selectedElementIdx!, { blocks: [...selectedElement.blocks, newBlock] }); setSelectedBlockIdx(selectedElement.blocks.length); }}>+ H1</Button>
                    <Button type="button" size="sm" onClick={() => { const newBlock = { id: Date.now().toString() + '-block', tag: 'h2', value: 'Subheading', style: { fontSize: '1.5em', color: '#fff', fontWeight: 'bold', fontStyle: 'normal', letterSpacing: '0px', lineHeight: '1.2', align: 'center' } }; updateElement(selectedElementIdx!, { blocks: [...selectedElement.blocks, newBlock] }); setSelectedBlockIdx(selectedElement.blocks.length); }}>+ H2</Button>
                    <Button type="button" size="sm" onClick={() => { const newBlock = { id: Date.now().toString() + '-block', tag: 'h3', value: 'Section', style: { fontSize: '1.2em', color: '#fff', fontWeight: 'bold', fontStyle: 'normal', letterSpacing: '0px', lineHeight: '1.2', align: 'center' } }; updateElement(selectedElementIdx!, { blocks: [...selectedElement.blocks, newBlock] }); setSelectedBlockIdx(selectedElement.blocks.length); }}>+ H3</Button>
                    <Button type="button" size="sm" onClick={() => { const newBlock = { id: Date.now().toString() + '-block', tag: 'p', value: 'Paragraph', style: { fontSize: '1em', color: '#fff', fontWeight: 'normal', fontStyle: 'normal', letterSpacing: '0px', lineHeight: '1.5', align: 'left' } }; updateElement(selectedElementIdx!, { blocks: [...selectedElement.blocks, newBlock] }); setSelectedBlockIdx(selectedElement.blocks.length); }}>+ P</Button>
                  </div>
                  {selectedBlockIdx !== null && selectedElement.blocks[selectedBlockIdx] && (
                    <>
                      <Label>Text</Label>
                      <Input value={selectedElement.blocks[selectedBlockIdx].value} onChange={e => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].value = e.target.value; updateElement(selectedElementIdx!, { blocks: newBlocks }); }} />
                      <Label>Font Size <span className="ml-2 text-xs text-muted-foreground">{parseInt(selectedElement.blocks[selectedBlockIdx].style?.fontSize || '24')}px</span></Label>
                      <Slider min={12} max={64} step={1} value={[parseInt(selectedElement.blocks[selectedBlockIdx].style?.fontSize || '24')]} onValueChange={([v]) => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.fontSize = v + 'px'; updateElement(selectedElementIdx!, { blocks: newBlocks }); }} />
                      <Label>Color</Label>
                      <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent" value={selectedElement.blocks[selectedBlockIdx].style?.color || '#ffffff'} onChange={e => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.color = e.target.value; updateElement(selectedElementIdx!, { blocks: newBlocks }); }} />
                      <Label>Alignment</Label>
                      <select className="w-full border rounded px-2 py-1" value={selectedElement.blocks[selectedBlockIdx].style?.align || 'center'} onChange={e => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.align = e.target.value; updateElement(selectedElementIdx!, { blocks: newBlocks }); }}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                      <div className="flex gap-2">
                        <Button type="button" variant={selectedElement.blocks[selectedBlockIdx].style?.fontWeight === 'bold' ? 'default' : 'outline'} size="sm" onClick={() => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.fontWeight = newBlocks[selectedBlockIdx].style.fontWeight === 'bold' ? 'normal' : 'bold'; updateElement(selectedElementIdx!, { blocks: newBlocks }); }}>B</Button>
                        <Button type="button" variant={selectedElement.blocks[selectedBlockIdx].style?.fontStyle === 'italic' ? 'default' : 'outline'} size="sm" onClick={() => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.fontStyle = newBlocks[selectedBlockIdx].style.fontStyle === 'italic' ? 'normal' : 'italic'; updateElement(selectedElementIdx!, { blocks: newBlocks }); }}><span style={{ fontStyle: 'italic' }}>I</span></Button>
                      </div>
                      <Label>Letter Spacing</Label>
                      <Slider min={-2} max={10} step={0.5} value={[parseFloat(selectedElement.blocks[selectedBlockIdx].style?.letterSpacing || '0')]} onValueChange={([v]) => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.letterSpacing = v + 'px'; updateElement(selectedElementIdx!, { blocks: newBlocks }); }} />
                      <Label>Line Spacing</Label>
                      <Slider min={1} max={2.5} step={0.05} value={[parseFloat(selectedElement.blocks[selectedBlockIdx].style?.lineHeight || '1.2')]} onValueChange={([v]) => { const newBlocks = [...selectedElement.blocks]; newBlocks[selectedBlockIdx].style.lineHeight = v.toString(); updateElement(selectedElementIdx!, { blocks: newBlocks }); }} />
                    </>
                  )}
                  <Button variant="destructive" className="w-full" onClick={() => { removeElement(selectedElementIdx!); setSelectedElementIdx(null); setSelectedBlockIdx(null); }}>Delete This Overlay</Button>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Click a text card in preview or list to edit or delete.</div>
              )}
              {pages[selectedPageIdx] && (
                <div className="space-y-4 mb-6">
                  <Label>CTA Button Text</Label>
                  <Input value={pages[selectedPageIdx].cta?.text || ""} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, cta: { ...p.cta, text: e.target.value } } : p))} placeholder="e.g. Read More" />
                  <Label>CTA Link/URL</Label>
                  <Input value={pages[selectedPageIdx].cta?.url || ""} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, cta: { ...p.cta, url: e.target.value } } : p))} placeholder="https://..." />
                  <Label>Button Color</Label>
                  <input type="color" value={pages[selectedPageIdx].cta?.bgColor || "#e11d48"} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, cta: { ...p.cta, bgColor: e.target.value } } : p))} />
                  <Label>Text Color</Label>
                  <input type="color" value={pages[selectedPageIdx].cta?.textColor || "#fff"} onChange={e => setPages(pages.map((p, i) => i === selectedPageIdx ? { ...p, cta: { ...p.cta, textColor: e.target.value } } : p))} />
                  {/* Preview CTA button */}
                  {pages[selectedPageIdx].cta?.text && pages[selectedPageIdx].cta?.url && (
                    <div className="flex justify-center mt-2">
                      <a
                        href={pages[selectedPageIdx].cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: pages[selectedPageIdx].cta.bgColor,
                          color: pages[selectedPageIdx].cta.textColor,
                          borderRadius: '999px',
                          padding: '0.75em 2em',
                          fontWeight: 700,
                          fontSize: '1.1em',
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          marginTop: 8,
                          display: 'inline-block',
                        }}
                      >
                        {pages[selectedPageIdx].cta.text}
                      </a>
                    </div>
                  )}
                </div>
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

      {/* At the bottom of the editor, add status select and draft/publish buttons */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
        <div className="flex items-center gap-2">
          <Label>Status</Label>
          <select className="border rounded px-2 py-1" value={meta.status} onChange={e => setMeta({ ...meta, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <Button variant="outline" onClick={(e) => handleSubmit(e, 'draft')}>Save as Draft</Button>
        <Button variant="default" onClick={(e) => handleSubmit(e, 'published')}>Publish</Button>
      </div>
    </AdminLayout>
  );
};

export default StoryEditor;
