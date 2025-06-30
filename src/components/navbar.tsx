import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { data: categories = [] } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-[#e11d48]">Aaj ki Story</Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-[#e11d48]">Home</Link>
          <div className="group relative">
            <button className="hover:text-[#e11d48]">Stories</button>
            <div className="absolute left-0 top-full bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition z-20 min-w-[180px]">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="block px-4 py-2 hover:bg-gray-100">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/blogs" className="hover:text-[#e11d48]">Blogs</Link>
          <Link to="/about" className="hover:text-[#e11d48]">About</Link>
          <Link to="/contact" className="hover:text-[#e11d48]">Contact</Link>
        </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-4 space-y-2">
          <Link to="/" className="block py-2" onClick={() => setMobileOpen(false)}>Home</Link>
          <div>
            <div className="font-semibold mb-1">Stories</div>
            <div className="pl-2 space-y-1">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="block py-1" onClick={() => setMobileOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/blogs" className="block py-2" onClick={() => setMobileOpen(false)}>Blogs</Link>
          <Link to="/about" className="block py-2" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="block py-2" onClick={() => setMobileOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 