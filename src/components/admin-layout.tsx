import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings, Plus, Eye, Save } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Eye },
    { href: "/admin/stories", label: "Stories", icon: Plus },
    { href: "/admin/categories", label: "Categories", icon: Save },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin Navbar */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard" className="text-2xl font-bold text-primary">
              Admin Panel
            </Link>
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    asChild
                  >
                    <Link to={item.href}>
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/">View Site</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};
