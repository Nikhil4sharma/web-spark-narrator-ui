
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for stories
  const stories = [
    {
      id: "1",
      title: "Amazing Travel Adventure",
      slug: "amazing-travel-adventure",
      category: "Travel",
      coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
      views: 1250,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Delicious Food Journey",
      slug: "delicious-food-journey",
      category: "Food",
      coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
      views: 890,
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      title: "Tech Innovation Spotlight",
      slug: "tech-innovation-spotlight",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop",
      views: 2100,
      createdAt: "2024-01-13"
    },
    {
      id: "4",
      title: "Fitness Transformation",
      slug: "fitness-transformation",
      category: "Health",
      coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      views: 1500,
      createdAt: "2024-01-12"
    }
  ];

  const categories = ["all", "Travel", "Food", "Technology", "Health"];

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">WebStory Hub</h1>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link to="/admin/login">Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Web Stories</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Immersive visual stories that captivate and inspire
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/story/${story.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {story.category}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="w-3 h-3 mr-1" />
                        {story.views.toLocaleString()}
                      </div>
                    </div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          
          {filteredStories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No stories found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 WebStory Hub. Built with modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
