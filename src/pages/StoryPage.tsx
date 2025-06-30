import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, Clock, User, Calendar, Tag, Share2, Heart, MessageCircle } from "lucide-react";
import { useStory } from "@/hooks/use-stories";
import { ThemeToggle } from "@/components/theme-toggle";
import { RelatedStories } from "@/components/related-stories";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const StoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: story, isLoading, error } = useStory(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="aspect-[16/9] w-full mb-6" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Story Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Stories
                </Link>
              </Button>
            </div>

            {/* Story Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline">{story.category}</Badge>
                <Badge variant="secondary">{story.status}</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {story.title}
              </h1>

              {/* Story Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {story.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(story.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {story.readingTime} min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {story.views.toLocaleString()} views
                </div>
              </div>

              {/* Cover Image */}
              {story.coverImage && (
                <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Tags */}
              {story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Story Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                {(() => {
                  try {
                    const pages = story.content ? JSON.parse(story.content) : null;
                    if (!pages) return <div className="text-center text-muted-foreground">No story content.</div>;
                    return <StoryMobilePreview pages={pages} meta={story} />;
                  } catch {
                    return <div className="text-center text-red-500">Invalid story content.</div>;
                  }
                })()}
              </CardContent>
            </Card>

            {/* Story Footer */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(story.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <Separator />

              {/* Author Info */}
              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{story.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      Story creator and content writer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Stories */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Stories</h2>
              <RelatedStories currentStoryId={story.id} category={story.category} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Update StoryMobilePreview to show Google AdSense ad after every 2 pages
const StoryMobilePreview = ({ pages, meta }: { pages: any[]; meta: any }) => {
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [adsensePublisherId, setAdsensePublisherId] = useState('ca-pub-4243233824220806');
  const [adsenseSlotId, setAdsenseSlotId] = useState('YOUR_SLOT_ID');
  const adRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [textFadeKey, setTextFadeKey] = useState(0);
  useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('settings').select('adsense_publisher_id,adsense_slot_id').limit(1).single();
      if (data) {
        if (data.adsense_publisher_id) setAdsensePublisherId(data.adsense_publisher_id);
        if (data.adsense_slot_id) setAdsenseSlotId(data.adsense_slot_id);
      }
    })();
  }, []);
  useEffect(() => {
    if (adRef.current) {
      const ads = adRef.current.querySelectorAll('.adsbygoogle');
      ads.forEach(ad => {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
      });
    }
  }, [selectedPageIdx, adsensePublisherId, adsenseSlotId]);
  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;
    let startX = 0;
    let endX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      if (endX - startX > 50 && selectedPageIdx > 0) {
        setSelectedPageIdx(selectedPageIdx - 1);
      } else if (startX - endX > 50 && selectedPageIdx < pages.length - 1) {
        setSelectedPageIdx(selectedPageIdx + 1);
      }
    };
    ref.addEventListener('touchstart', handleTouchStart, { passive: true });
    ref.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      ref.removeEventListener('touchstart', handleTouchStart);
      ref.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedPageIdx, pages.length]);
  useEffect(() => {
    setTextFadeKey(prev => prev + 1);
  }, [selectedPageIdx]);
  // Click navigation (desktop)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    if (x < bounds.width / 2 && selectedPageIdx > 0) {
      setSelectedPageIdx(selectedPageIdx - 1);
    } else if (x >= bounds.width / 2 && selectedPageIdx < pages.length - 1) {
      setSelectedPageIdx(selectedPageIdx + 1);
    }
  };
  if (!pages || !pages.length) return <div className="text-center text-muted-foreground">No story content.</div>;
  const page = pages[selectedPageIdx];
  const showAd = (idx: number) => (idx + 1) % 2 === 0 && idx < pages.length - 1;
  // Responsive style
  const containerClass = isMobile
    ? 'fixed inset-0 w-screen h-screen bg-black z-50 flex flex-col items-center justify-center overflow-hidden'
    : 'relative w-[320px] h-[570px] mx-auto bg-gradient-to-br from-white/80 to-gray-100/80 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center';
  useEffect(() => {
    const img = document.querySelector('.story-bg-zoom');
    if (img) {
      img.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.08)' }
      ], {
        duration: 3000,
        fill: 'forwards',
        easing: 'cubic-bezier(0.4,0,0.2,1)'
      });
    }
  }, [selectedPageIdx]);
  return (
    <div
      ref={containerRef}
      className={containerClass}
      onClick={handleClick}
      style={{ touchAction: 'pan-y', WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Progress Bar */}
      <div className={isMobile ? 'flex gap-1 w-full z-30' : 'absolute w-full flex gap-1 z-30'} style={{ top: 16, left: 0, position: 'absolute', margin: 0, padding: 0 }}>
        {pages.map((_, idx) => (
          <div key={idx} className={`flex-1 h-1 rounded-full transition-all duration-300 ${idx <= selectedPageIdx ? 'bg-white' : 'bg-gray-400/50'}`}></div>
        ))}
      </div>
      {/* Publisher logo + title */}
      {meta?.publisherLogo && (
        <div className={isMobile ? 'absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20' : 'absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20'}>
          <img src={meta.publisherLogo} alt="Publisher Logo" className="w-12 h-12 object-contain rounded-full bg-white/90 shadow" />
          <div className="text-center mt-1">
            <span className="block text-lg font-bold text-red-600 leading-none">Aaj ki</span>
            <span className="block text-base font-semibold text-neutral-900 leading-none">Story</span>
          </div>
        </div>
      )}
      {/* Background */}
      {page.backgroundType === 'image' && page.backgroundUrl && (
        <img
          src={page.backgroundUrl}
          alt={page.backgroundAlt || 'story background'}
          className="absolute inset-0 w-full h-full object-cover z-0 story-bg-zoom"
          style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 3s cubic-bezier(0.4,0,0.2,1)', transform: 'scale(1.08)' }}
          key={selectedPageIdx}
        />
      )}
      {page.backgroundType === 'video' && page.backgroundUrl && (
        <video src={page.backgroundUrl} className="absolute inset-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline aria-label={page.backgroundAlt || 'story background video'} />
      )}
      {/* Text Card (bottom) */}
      {page.elements.map((el: any) => {
        if (el.type === 'text') {
          return (
            <div
              key={el.id + '-' + textFadeKey}
              className="fade-in-text-card"
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3,
              }}
            >
              <div style={{
                width: '100%',
                background: 'rgba(0,0,0,0.10)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderTopLeftRadius: '2rem',
                borderTopRightRadius: '2rem',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                padding: '1.25rem 1.5rem',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '3.5rem',
                height: 'auto',
              }}>
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
      {/* Google AdSense ad after every 2 pages */}
      {showAd(selectedPageIdx) && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
          <ins className="adsbygoogle"
            style={{ display: 'block', width: 300, height: 250 }}
            data-ad-client={adsensePublisherId}
            data-ad-slot={adsenseSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
      )}
      {/* After the text card, render CTA button if present */}
      {page.cta && page.cta.text && page.cta.url && (
        <div style={{
          position: 'absolute',
          left: 0,
          bottom: '80px', // above text card
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 4,
          pointerEvents: 'auto',
        }}>
          <a
            href={page.cta.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: page.cta.bgColor || '#e11d48',
              color: page.cta.textColor || '#fff',
              borderRadius: '999px',
              padding: '0.75em 2em',
              fontWeight: 700,
              fontSize: '1.1em',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              marginTop: 8,
              display: 'inline-block',
              pointerEvents: 'auto',
            }}
          >
            {page.cta.text}
          </a>
        </div>
      )}
    </div>
  );
};

export default StoryPage;
