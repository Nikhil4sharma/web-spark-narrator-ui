import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Settings, TrendingUp, Calendar, Users, FileText, Loader2, Clock } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useRecentStories } from "@/hooks/use-dashboard";
import { useDeleteStory } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentStories = [], isLoading: storiesLoading } = useRecentStories();
  const deleteStoryMutation = useDeleteStory();

  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
      try {
        await deleteStoryMutation.mutateAsync(storyId);
        toast({
          title: "Story deleted",
          description: `"${storyTitle}" has been deleted successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete story. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Loading skeleton for stats cards
  const StatsSkeleton = () => (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );

  // Loading skeleton for story items
  const StorySkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatsSkeleton key={i} />)
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Total Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalStories || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.publishedStories || 0} published, {stats?.draftStories || 0} drafts
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(stats?.totalViews || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.monthlyViews || 0} this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Published
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.publishedStories || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.totalStories ? Math.round((stats.publishedStories / stats.totalStories) * 100) : 0}% of total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalCategories || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active categories
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-20">
                <Link to="/admin/story/new" className="flex flex-col items-center">
                  <Plus className="w-6 h-6 mb-2" />
                  Create New Story
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20">
                <Link to="/admin/categories" className="flex flex-col items-center">
                  <FileText className="w-6 h-6 mb-2" />
                  Manage Categories
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20">
                <Link to="/admin/settings" className="flex flex-col items-center">
                  <Settings className="w-6 h-6 mb-2" />
                  Site Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Stories
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/story/new">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storiesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => <StorySkeleton key={i} />)}
              </div>
            ) : (
              <div className="space-y-4">
                {recentStories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No stories yet</p>
                    <p className="text-sm mb-4">Create your first story to get started</p>
                    <Button asChild>
                      <Link to="/admin/story/new">Create Story</Link>
                    </Button>
                  </div>
                ) : (
                  recentStories.map((story) => (
                    <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{story.title}</h3>
                          <Badge variant={story.status === 'published' ? 'default' : 'secondary'}>
                            {story.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {story.views.toLocaleString()} views
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {story.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(story.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/story/edit/${story.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteStory(story.id, story.title)}
                          disabled={deleteStoryMutation.isPending}
                        >
                          {deleteStoryMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
