"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Activity, Cpu } from "lucide-react";

interface TechCardProps {
  title: string;
  description: string;
  icon: any;
  delay?: number;
}

export function TechCard({ title, description, icon: Icon, delay = 0 }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="relative group w-full"
    >
      {/* Animated Glow Backdrop */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-obscura-blue/20 to-obscura-arcane/20 rounded-sm blur opacity-20 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative noir-card p-12 overflow-hidden border-obscura-blue/20 bg-black/40 backdrop-blur-xl">
        {/* Tech Decor: Corner Brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-obscura-blue opacity-50"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-obscura-blue opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-obscura-blue opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-obscura-blue opacity-50"></div>

        {/* Moving Scanline */}
        <motion.div
          animate={{ top: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-obscura-blue/10 to-transparent pointer-events-none"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-4 bg-obscura-blue/10 border border-obscura-blue/40 rounded-sm shadow-[0_0_15px_rgba(0,212,255,0.1)]"
            >
              <Icon className="w-8 h-8 text-obscura-blue" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-obscura-blue uppercase tracking-[0.3em] font-bold">Protocol_v1.04</span>
              <h3 className="font-display text-4xl text-white uppercase tracking-tighter italic glitch-text">{title}</h3>
            </div>
          </div>

          <p className="text-white/80 font-light leading-relaxed text-lg mb-10 font-body">
            {description}
          </p>

          {/* Bottom Data Bar */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-obscura-blue animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-obscura-blue/50"></div>
              <div className="w-1.5 h-1.5 bg-obscura-blue/20"></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-obscura-blue/60 uppercase tracking-widest animate-pulse">
                [ Syncing_State... ]
              </span>
              <span className="font-mono text-[9px] text-obscura-smoke uppercase tracking-widest border-l border-white/10 pl-4">
                ZK_v1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MadAnimationCard({ delay = 0.2 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="relative group w-full"
    >
      {/* Animated Glow Backdrop */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-obscura-blue/20 to-obscura-arcane/20 rounded-sm blur opacity-20 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative noir-card p-12 overflow-hidden border-obscura-blue/20 bg-black/40 backdrop-blur-xl">
        {/* Tech Decor: Corner Brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-obscura-blue opacity-50"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-obscura-blue opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-obscura-blue opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-obscura-blue opacity-50"></div>

        {/* Rotating Tech Rings in background */}
        <div className="absolute -right-20 -top-20 pointer-events-none opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-64 h-64 border-2 border-dashed border-obscura-blue rounded-full"
          />
        </div>

        {/* Vertical Laser Scan */}
        <motion.div
          animate={{ left: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-[2px] bg-obscura-blue shadow-[0_0_20px_rgba(0,212,255,1)] pointer-events-none z-20 opacity-30"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <motion.div 
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-obscura-blue/20 border-2 border-obscura-blue rounded-sm shadow-[0_0_25px_rgba(0,212,255,0.2)]"
            >
              <Cpu className="w-8 h-8 text-obscura-blue" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-obscura-blue uppercase tracking-[0.3em] font-bold">Absolute_Control</span>
              <h3 className="font-display text-4xl text-white uppercase tracking-tighter italic glitch-text">Sovereignty</h3>
            </div>
          </div>

          <p className="text-white/90 font-light leading-relaxed text-xl mb-12 font-body italic">
            "Your keys, your shadows, your absolute control. The protocol is a weapon 
            of autonomy in the age of total visibility."
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 mb-12 py-8 border-y border-white/5 bg-white/[0.02]">
            {[
              { label: "LATENCY", val: "14ms" },
              { label: "ENTROPY", val: "MAX" },
              { label: "UPTIME", val: "99.9%" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-mono text-[9px] text-obscura-blue/60 mb-2 tracking-[0.2em] uppercase">{stat.label}</span>
                <span className="text-display text-xl text-white italic">{stat.val}</span>
              </div>
            ))}
          </div>

          {/* Bottom Data Bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-obscura-blue animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-obscura-blue animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1.5 h-1.5 bg-obscura-blue animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <span className="font-mono text-[9px] text-obscura-blue/80 uppercase tracking-widest animate-pulse">
              [ HIGH_INTENSITY_PROTOCOL_ACTIVE ]
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
