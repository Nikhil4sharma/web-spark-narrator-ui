
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Share } from "lucide-react";

const StoryPage = () => {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Mock story data
  const story = {
    id: "1",
    title: "Amazing Travel Adventure",
    slug: "amazing-travel-adventure",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
    pages: [
      {
        id: "1",
        backgroundImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
        layers: [
          {
            id: "1",
            type: "text",
            content: "Welcome to Paradise",
            style: {
              fontSize: "2xl",
              color: "white",
              position: "bottom",
              textAlign: "center",
              fontWeight: "bold"
            }
          }
        ]
      },
      {
        id: "2",
        backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
        layers: [
          {
            id: "2",
            type: "text",
            content: "Discover Hidden Gems",
            style: {
              fontSize: "xl",
              color: "white",
              position: "center",
              textAlign: "center",
              fontWeight: "semibold"
            }
          }
        ]
      },
      {
        id: "3",
        backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        layers: [
          {
            id: "3",
            type: "text",
            content: "Adventure Awaits",
            style: {
              fontSize: "lg",
              color: "white",
              position: "top",
              textAlign: "left",
              fontWeight: "medium"
            }
          }
        ]
      }
    ],
    views: 1250,
    duration: 5000
  };

  // Auto-advance pages
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentPage(prev => 
        prev >= story.pages.length - 1 ? 0 : prev + 1
      );
    }, story.duration);

    return () => clearInterval(timer);
  }, [currentPage, isAutoPlaying, story.duration, story.pages.length]);

  const nextPage = () => {
    setCurrentPage(prev => 
      prev >= story.pages.length - 1 ? 0 : prev + 1
    );
  };

  const prevPage = () => {
    setCurrentPage(prev => 
      prev <= 0 ? story.pages.length - 1 : prev - 1
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const currentStoryPage = story.pages[currentPage];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Story Container */}
      <div className="relative w-full max-w-sm h-screen bg-black overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentStoryPage.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="flex space-x-1">
            {story.pages.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    index < currentPage ? 'w-full' : 
                    index === currentPage ? 'w-1/2' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:bg-white/20"
          >
            <Link to="/">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-white text-sm">
              <Eye className="w-4 h-4 mr-1" />
              {story.views.toLocaleString()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Story Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {currentStoryPage.layers.map((layer) => {
            if (layer.type === 'text') {
              const positionClasses = {
                top: 'top-24',
                center: 'top-1/2 -translate-y-1/2',
                bottom: 'bottom-24'
              };
              
              const alignClasses = {
                left: 'text-left',
                center: 'text-center',
                right: 'text-right'
              };

              return (
                <div
                  key={layer.id}
                  className={`absolute left-4 right-4 px-4 ${positionClasses[layer.style.position]} ${alignClasses[layer.style.textAlign]}`}
                >
                  <h2
                    className={`text-${layer.style.fontSize} font-${layer.style.fontWeight} text-${layer.style.color} drop-shadow-lg`}
                  >
                    {layer.content}
                  </h2>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Navigation Areas */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-30 focus:outline-none"
          onClick={prevPage}
        />
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-30 focus:outline-none"
          onClick={nextPage}
        />
        <button
          className="absolute left-1/3 top-0 w-1/3 h-full z-30 focus:outline-none"
          onClick={toggleAutoPlay}
        />

        {/* Story Info */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
            <h1 className="text-lg font-bold mb-1">{story.title}</h1>
            <p className="text-sm text-white/80">{story.category}</p>
            <div className="mt-2 text-xs text-white/60">
              {isAutoPlaying ? 'Tap to pause' : 'Tap to play'} • Page {currentPage + 1} of {story.pages.length}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Instructions */}
      <div className="hidden lg:block absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Use arrow keys or click to navigate</p>
        <p>Spacebar to pause/play</p>
      </div>
    </div>
  );
};

export default StoryPage;
