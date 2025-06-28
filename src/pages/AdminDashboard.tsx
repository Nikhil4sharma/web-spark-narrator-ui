import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Settings } from "lucide-react";

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalStories: 24,
    totalViews: 15420,
    publishedStories: 18,
    draftStories: 6,
  };

  const recentStories = [
    {
      id: "1",
      title: "Amazing Travel Adventure",
      status: "Published",
      views: 1250,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Delicious Food Journey",
      status: "Draft",
      views: 0,
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      title: "Tech Innovation Spotlight",
      status: "Published",
      views: 2100,
      createdAt: "2024-01-13",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStories}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.publishedStories}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.draftStories}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
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
                  <Settings className="w-6 h-6 mb-2" />
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
            <CardTitle>Recent Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStories.map((story) => (
                <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{story.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        story.status === 'Published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {story.status}
                      </span>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {story.views.toLocaleString()} views
                      </div>
                      <span>{story.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/story/edit/${story.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
