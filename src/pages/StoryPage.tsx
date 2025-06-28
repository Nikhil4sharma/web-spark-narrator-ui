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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              WebStory Hub
            </Link>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link to="/admin/login">Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {/* Convert markdown-like content to HTML */}
                {story.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return <br key={index} />;
                  
                  // Simple markdown parsing
                  let processedParagraph = paragraph;
                  
                  // Bold text
                  processedParagraph = processedParagraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  
                  // Italic text
                  processedParagraph = processedParagraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
                  
                  // Links
                  processedParagraph = processedParagraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
                  
                  // Headers
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.substring(3)}</h2>;
                  }
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>;
                  }
                  
                  return (
                    <p key={index} className="mb-4 leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: processedParagraph }} />
                  );
                })}
              </div>
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
    </div>
  );
};

export default StoryPage;
