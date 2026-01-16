"use client";

import { motion } from "framer-motion";

export function RuneDecoration() {
  const runes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ"];
  
  return (
    <>
      {/* Left rune column */}
      <div className="absolute left-8 top-1/4 hidden lg:flex flex-col gap-8 opacity-20">
        {runes.slice(0, 6).map((rune, i) => (
          <motion.span
            key={`left-${i}`}
            className="text-3xl text-obscura-arcane rune-glyph"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
          >
            {rune}
          </motion.span>
        ))}
      </div>
      
      {/* Right rune column */}
      <div className="absolute right-8 top-1/4 hidden lg:flex flex-col gap-8 opacity-20">
        {runes.slice(6, 12).map((rune, i) => (
          <motion.span
            key={`right-${i}`}
            className="text-3xl text-obscura-arcane rune-glyph"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, delay: i * 0.5 + 0.25, repeat: Infinity }}
          >
            {rune}
          </motion.span>
        ))}
      </div>

      {/* Circular decoration behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          className="w-[600px] h-[600px] border border-obscura-arcane/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 border border-obscura-arcane/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-16 border border-dashed border-obscura-arcane/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </>
  );
}
