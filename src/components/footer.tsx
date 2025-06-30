import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-[#f6f8ff] border-t border-red-200 pt-8 pb-4 px-2 mt-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
      {/* Logo and Description */}
      <div className="flex-1 flex flex-col items-center md:items-start">
        <img src="/logo.png" alt="TaazaTime Logo" className="w-32 mb-2" />
        <p className="text-sm text-center md:text-left max-w-md">
          <b>TaazaTime:</b> your ultimate news destination, delivering the latest and most reliable updates including automobiles, business, technology, finance, entertainment, education, and sports 🚀
        </p>
      </div>
      {/* Social Media */}
      <div className="flex-1 flex flex-col items-center md:items-end">
        <div className="flex items-center mb-2">
          <svg width="24" height="24" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24" className="mr-2"><path d="M4 4v16h16V4H4zm8 14a6 6 0 100-12 6 6 0 000 12z" /></svg>
          <div>
            <div className="font-semibold">Follow Us On Social Media</div>
            <div className="text-xs text-muted-foreground">Get Latest Update On Social Media</div>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          {/* Social Icons with tooltips */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
            <svg className="w-8 h-8 text-blue-600 hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">
            <svg className="w-8 h-8 text-green-500 hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.13 1.6 5.93L0 24l6.24-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.7.97.99-3.6-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.28.7.9.86 1.08.16.18.32.2.6.07.28.14-1.18.44-2.25 1.4-.83.74-1.39 1.65-1.55 1.93-.16.28.02.43.12.57.13.13.28.34.42.51.14.17.18.29.28.48.09.19.05.36.02.5.07.14.61 1.47.84 2.01.22.53.45.46.61.47.16.01.35.01.54.01.19 0 .5-.07.76-.34.26-.27 1-1.01 1-2.46s-1.02-2.85-1.16-3.05c-.14-.2-2.01-3.08-4.88-4.2-.68-.29-1.21-.46-1.62-.59-.68-.22-1.3.19-1.79.12-1.32.07.12.25.19.53.33z"/></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
            <svg className="w-8 h-8 text-pink-500 hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.388 3.678 1.37 2.697 2.352 2.437 3.464 2.379 4.745 2.321 6.025 2.309 6.434 2.309 12c0 5.566.012 5.975.07 7.255.058 1.281.318 2.393 1.299 3.375.981.982 2.093 1.242 3.374 1.3 1.28.058 1.689.07 7.255.07s5.975-.012 7.255-.07c1.281-.058 2.393-.318 3.374-1.3.981-.982 1.241-2.094 1.299-3.375.058-1.28.07-1.689.07-7.255s-.012-5.975-.07-7.255c-.058-1.281-.318-2.393-1.299-3.375C19.647.388 18.535.128 17.255.07 15.975.012 15.566 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube">
            <svg className="w-8 h-8 text-red-500 hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 00-2.112-2.112C19.545 3.5 12 3.5 12 3.5s-7.545 0-9.386.574a2.994 2.994 0 00-2.112 2.112C0 8.027 0 12 0 12s0 3.973.502 5.814a2.994 2.994 0 002.112 2.112C4.455 20.5 12 20.5 12 20.5s7.545 0 9.386-.574a2.994 2.994 0 002.112-2.112C24 15.973 24 12 24 12s0-3.973-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>
    </div>
    {/* Links */}
    <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-black/80">
      <a href="/about" className="hover:underline">About Us</a>
      <a href="/contact" className="hover:underline">Contact Us</a>
      <a href="/disclaimer" className="hover:underline">Disclaimer</a>
      <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
      <a href="/apply-for-job" className="hover:underline">Apply For Job</a>
      <a href="/correction-policy" className="hover:underline">Correction Policy</a>
      <a href="/dnpa-code-of-ethics" className="hover:underline">DNPA Code of Ethics</a>
      <a href="/fact-checking-policy" className="hover:underline">Fact Checking Policy</a>
    </nav>
    <div className="text-center text-xs text-red-600 mt-2">© 2025 TaazaTime.com All rights reserved</div>
  </footer>
);

export default Footer; 