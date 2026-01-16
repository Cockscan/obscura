"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-12 bg-black/90 backdrop-blur-xl border-t border-white/5 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
        {/* Logo & Status */}
        <div className="flex items-center gap-4">
          <h2 className="text-display text-lg sm:text-2xl text-white italic tracking-tighter">Obscura</h2>
          <span className="hidden lg:block w-px h-4 bg-white/10" />
          <p className="hidden lg:block text-obscura-smoke text-[10px] uppercase tracking-[0.2em] font-mono">
            [ System Status: Nominal ]
          </p>
        </div>
        
        {/* Links & Social */}
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
          {/* Nav Links - Hidden on very small screens */}
          <div className="hidden sm:flex gap-4 lg:gap-8">
            <Link href="/vaporize" className="text-obscura-smoke hover:text-obscura-blue transition-colors text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono">Vaporize</Link>
            <Link href="/condense" className="text-obscura-smoke hover:text-obscura-blue transition-colors text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono">Condense</Link>
            <Link href="/history" className="text-obscura-smoke hover:text-obscura-blue transition-colors text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono">Ledger</Link>
          </div>
          
          {/* X Link */}
          <a 
            href="https://x.com/obscura" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-obscura-smoke hover:text-obscura-blue transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          
          {/* Copyright */}
          <span className="text-[9px] sm:text-[10px] text-white/20 font-mono uppercase tracking-widest">
            © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
