import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Eye, Clock, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStories } from "@/hooks/use-stories";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/footer";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch stories and categories using custom hooks
  const { data: storiesData, isLoading: storiesLoading, error: storiesError } = useStories({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const stories = storiesData?.stories || [];

  // Loading skeleton component
  const StorySkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );

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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Amazing Web Stories
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Immersive visual stories that captivate and inspire. Explore curated content from around the world.
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories by title, author, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-input bg-background rounded-md h-12 text-base"
                disabled={categoriesLoading}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({category.storyCount})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results Info */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                {storiesLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <p className="text-muted-foreground">
                    {stories.length} {stories.length === 1 ? 'story' : 'stories'} found
                    {searchTerm && ` for "${searchTerm}"`}
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                  </p>
                )}
              </div>
              {storiesLoading && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading stories...</span>
                </div>
              )}
            </div>
          </div>

          {/* Stories Grid */}
          {storiesError ? (
            <div className="text-center py-16">
              <div className="text-red-500 mb-4">
                <p className="text-lg font-medium">Failed to load stories</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {storiesLoading
                ? Array.from({ length: 8 }).map((_, i) => <StorySkeleton key={i} />)
                : stories.map((story) => (
                    <Card key={story.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <Link to={`/story/${story.slug}`}>
                        <div className="aspect-[3/4] overflow-hidden relative">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                              {story.category}
                            </span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Eye className="w-3 h-3 mr-1" />
                              {story.views.toLocaleString()}
                            </div>
                          </div>
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {story.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {story.author}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {story.readingTime} min read
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
            </div>
          )}
          
          {!storiesLoading && stories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No stories found</p>
                <p className="text-sm">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search criteria or browse all categories."
                    : "Check back later for new stories!"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
