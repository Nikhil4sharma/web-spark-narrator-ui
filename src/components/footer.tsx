import React from "react";

// Structured data for SEO (Organization)
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aaj ki Story",
  "url": "https://aajkistory.com/",
  "logo": "https://aajkistory.com/logo.png",
  "sameAs": [
    "https://facebook.com", "https://instagram.com", "https://youtube.com", "https://wa.me/"
  ]
};

// Footer config for future admin editing
const footerConfig = {
  brand: "Aaj ki Story",
  description:
    "Aaj ki Story: India's trusted news platform for latest updates in business, tech, finance, entertainment, education, sports & more. Reliable, fast, and unbiased news for every Indian.",
  social: [
    { href: "https://facebook.com", icon: "facebook", label: "Facebook" },
    { href: "https://wa.me/", icon: "whatsapp", label: "WhatsApp" },
    { href: "https://instagram.com", icon: "instagram", label: "Instagram" },
    { href: "https://youtube.com", icon: "youtube", label: "YouTube" },
  ],
  links: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/apply-for-job", label: "Apply For Job" },
    { href: "/correction-policy", label: "Correction Policy" },
    { href: "/dnpa-code-of-ethics", label: "DNPA Code of Ethics" },
    { href: "/fact-checking-policy", label: "Fact Checking Policy" },
  ],
  copyright: "© 2025 Aaj ki Story. All rights reserved.",
};

// Modern news icon SVG
const NewsIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 drop-shadow-lg">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="#fff" />
    <path d="M7 8h10M7 12h6M7 16h10" stroke="#e11d48" />
    <circle cx="17" cy="12" r="1.5" fill="#e11d48" />
  </svg>
);

// Minimalistic SVGs for social icons
const MinimalFacebook = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1877F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.1h-3.2C10.2 2.1 9 3.3 9 5.7v2.1H7v3h2v8h3v-8h2.1l.4-3H12V5.7c0-.3.1-.6.6-.6H17V2.1z"/></svg>
);
const MinimalWhatsapp = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 00-8.5 15.6L2 22l4.6-1.2A10 10 0 1012 2zm5.2 13.2c-.3-.2-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.8-2-.2-.5-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.8 1.2 3.1c.2.2 2 3.1 4.9 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.5-.3z"/></svg>
);
const MinimalInstagram = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
);
const MinimalYoutube = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><polygon points="10 9 16 12 10 15 10 9" fill="#FF0000"/></svg>
);

// Social icon SVGs
const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "facebook":
      return (
        <MinimalFacebook />
      );
    case "whatsapp":
      return (
        <MinimalWhatsapp />
      );
    case "instagram":
      return (
        <MinimalInstagram />
      );
    case "youtube":
      return (
        <MinimalYoutube />
      );
    default:
      return null;
  }
};

// Simulate admin check (replace with real auth logic)
const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

const Footer: React.FC = () => (
  <footer className="bg-[#f8fafc] border-t border-gray-200 pt-10 pb-4 px-2 w-full mt-12">
    {/* SEO Structured Data */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 px-2 sm:px-4 w-full flex-wrap">
      {/* Brand & Description */}
      <div className="flex-1 flex flex-col items-center md:items-start min-w-[220px] mb-6 md:mb-0">
        <div className="flex items-center mb-2 justify-center md:justify-start w-full">
          <NewsIcon />
          <span className="text-2xl md:text-3xl font-extrabold text-[#e11d48] tracking-tight ml-2">{footerConfig.brand}</span>
        </div>
        <p className="text-sm text-center md:text-left max-w-md px-2 md:px-0 text-gray-700 font-medium">
          {footerConfig.description}
        </p>
        {isAdmin && (
          <a href="/admin/footer-edit" className="mt-2 text-xs text-blue-600 underline hover:text-blue-800 block text-center md:text-left opacity-70 hover:opacity-100 transition">Edit Footer</a>
        )}
      </div>
      {/* Links */}
      <nav className="flex-1 flex flex-wrap justify-center items-center gap-4 text-sm text-black/80 w-full md:w-auto mb-6 md:mb-0" aria-label="Footer Navigation">
        {footerConfig.links.map((l) => (
          <a key={l.href} href={l.href} className="hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded text-gray-800 font-medium px-2 py-1" aria-label={l.label}>{l.label}</a>
        ))}
      </nav>
      {/* Social Media */}
      <div className="flex-1 flex flex-col items-center md:items-end min-w-[220px]">
        <div className="flex items-center mb-2 justify-center md:justify-end w-full">
          <span className="font-semibold text-gray-900 text-lg mr-2">Follow Us</span>
        </div>
        <div className="flex gap-3 mt-2 justify-center md:justify-end w-full">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook" className="focus:outline-none rounded-full transition-transform hover:scale-110 hover:brightness-110">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" width={38} height={38} className="rounded-full" />
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp" className="focus:outline-none rounded-full transition-transform hover:scale-110 hover:brightness-110">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" width={38} height={38} className="rounded-full" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="focus:outline-none rounded-full transition-transform hover:scale-110 hover:brightness-110">
            <img src="https://cdn-icons-png.flaticon.com/512/15707/15707749.png" alt="Instagram" width={38} height={38} className="rounded-full" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube" className="focus:outline-none rounded-full transition-transform hover:scale-110 hover:brightness-110">
            <img src="https://cdn-icons-png.flaticon.com/512/15707/15707814.png" alt="YouTube" width={38} height={38} className="rounded-full" />
          </a>
        </div>
      </div>
    </div>
    <div className="text-center text-xs text-red-600 mt-6 w-full font-semibold tracking-wide drop-shadow-sm">
      {footerConfig.copyright}
    </div>
  </footer>
);

export default Footer; 