import { useStories } from "@/hooks/use-stories";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Eye, Clock, Calendar } from "lucide-react";

interface RelatedStoriesProps {
  currentStoryId: string;
  category: string;
}

export const RelatedStories = ({ currentStoryId, category }: RelatedStoriesProps) => {
  const { data, isLoading, error } = useStories({
    category,
    limit: 3
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <Skeleton className="aspect-[3/4] w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data?.stories) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load related stories</p>
      </div>
    );
  }

  // Filter out the current story and get up to 3 related stories
  const relatedStories = data.stories
    .filter(story => story.id !== currentStoryId)
    .slice(0, 3);

  if (relatedStories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No related stories found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedStories.map((story) => (
        <Card key={story.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
          <Link to={`/story/${story.slug}`}>
            <div className="aspect-[3/4] overflow-hidden">
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">No Image</p>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {story.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {story.status}
                </Badge>
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {story.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {story.readingTime} min
                </div>
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {story.views}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(story.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}; 