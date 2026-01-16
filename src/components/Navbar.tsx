"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WalletButton } from "./WalletButton";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { href: "/vaporize", label: "Vaporize" },
    { href: "/condense", label: "Condense" },
    { href: "/history", label: "Ledger" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-display text-xl sm:text-2xl text-white italic tracking-tighter">
                Obscura
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span 
                  className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.3em] lg:tracking-[0.4em] text-white hover:text-obscura-blue transition-colors relative group"
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
            
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-obscura-void border-l border-white/10 p-8 pt-24"
            >
              <div className="flex flex-col gap-8">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="font-display text-3xl text-white italic hover:text-obscura-blue transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 border-t border-white/10"
                >
                  <WalletButton />
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-obscura-blue animate-pulse"></div>
                  <span className="font-mono text-[10px] text-obscura-smoke uppercase tracking-widest">
                    Protocol Active
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
