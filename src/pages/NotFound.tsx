import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center bg-white/80 rounded-3xl shadow-xl p-10 max-w-lg w-full animate-fade-in">
          {/* Modern 404 Illustration */}
          <div className="mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-slow">
              <circle cx="60" cy="60" r="58" fill="#e0e7ff" stroke="#e11d48" strokeWidth="4" />
              <text x="50%" y="54%" textAnchor="middle" fill="#e11d48" fontSize="48" fontWeight="bold" dy=".3em" fontFamily="'Inter',sans-serif">404</text>
              <circle cx="45" cy="80" r="5" fill="#e11d48" opacity="0.2" />
              <circle cx="75" cy="80" r="5" fill="#e11d48" opacity="0.2" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-[#e11d48] mb-2 tracking-tight">Page Not Found</h1>
          <p className="mb-6 text-lg text-gray-700 text-center">Oops! The page you are looking for doesn't exist or has been moved.</p>
          <a href="/" className="inline-block bg-[#e11d48] text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#be123c] transition">Return to Home</a>
        </div>
      </main>
      <Footer />
      <style>{`
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fadeIn 1.2s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
