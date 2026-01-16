"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Shield, Fingerprint, Lock, Zap, Layers, Globe } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TechCard, MadAnimationCard } from "@/components/TechCard";
import { useRef } from "react";

function RevealText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`overflow-visible ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.5]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <main ref={containerRef} className="relative min-h-screen flex flex-col pb-32">
      <Navbar />
      
      {/* Background Glows */}
      <div className="blue-glow top-[-10%] right-[-10%] opacity-50" />
      <div className="blue-glow bottom-[-10%] left-[-10%] opacity-30" />
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 overflow-hidden">
        <motion.div style={{ scale: springScale, opacity }} className="max-w-full z-10">
          <h1 className="text-display text-6xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[140px] leading-[0.85] mb-12 max-w-[100vw]">
            <RevealText className="glitch-text whitespace-nowrap">Privacy</RevealText>
            <RevealText className="text-obscura-blue italic whitespace-nowrap">Architected</RevealText>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-end gap-12 mt-16">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-body text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed font-light"
            >
              High-performance privacy protocol on Solana. 
              Sever the transaction graph with <span className="text-obscura-blue font-bold">Zero-Knowledge</span> synthesis.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Link href="/vaporize">
                <button className="btn-noir group">
                  Initiate Protocol
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Hint */}
        <div className="absolute bottom-12 left-24 hidden md:block opacity-30">
          <div className="flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-obscura-blue rotate-90 mb-4">Syncing</span>
            <div className="w-px h-12 bg-obscura-blue" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-24 sm:py-40 md:py-60 px-4 sm:px-6 md:px-24 section-border relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="lg:sticky lg:top-40 h-fit">
            <span className="font-mono text-xs uppercase tracking-widest text-obscura-blue mb-8 block">
              // LOG_01: Philosophy
            </span>
            <h2 className="text-display text-5xl md:text-9xl mb-12 italic text-white leading-tight">
              <RevealText>Break the</RevealText>
              <RevealText className="text-obscura-blue">Chain.</RevealText>
            </h2>
          </div>
          
          <div className="space-y-24 py-12 lg:py-24">
            <div className="max-w-xl">
              <p className="text-2xl text-white/70 font-light leading-relaxed mb-8">
                Autonomy is the prime directive. In a world of absolute surveillance, 
                <span className="text-white italic"> Obscura</span> restores the shadows.
              </p>
            </div>

            <div className="flex flex-col gap-16">
              <TechCard 
                title="Unlinkable" 
                description="Mixers are predictable. Obscura is noise. We sever the mathematical links that bind your past to your future."
                icon={Fingerprint}
                delay={0}
              />
              
              <TechCard 
                title="Zero Trust" 
                description="No keys. No secrets. No custody. Only immutable laws enforced by the Solana runtime and ZK circuits."
                icon={Shield}
                delay={0.1}
              />

              <MadAnimationCard delay={0.2} />
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECS SECTION */}
      <section className="py-24 sm:py-40 md:py-60 px-4 sm:px-6 md:px-24 section-border bg-obscura-mist/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-obscura-blue mb-12 sm:mb-24 block">
            // LOG_02: Specifications
          </span>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-12 sm:gap-y-16 lg:gap-y-32">
            {[
              { icon: Shield, title: "Vapor Addr", desc: "Edwards curve points derived as unspendable constructs." },
              { icon: Fingerprint, title: "ZK-Witness", desc: "Prove vaporization without revealing the transaction." },
              { icon: Layers, title: "Merkle Accum", desc: "On-chain state tracking via persistent Merkle trees." },
              { icon: Zap, title: "Condense", desc: "Materialize tokens in fresh sovereign wallets." },
              { icon: Lock, title: "Token-2022", desc: "Full compatibility with next-gen Solana extensions." },
              { icon: Globe, title: "Local Proof", desc: "Secrets never leave your terminal. Absolute sovereignty." }
            ].map((item, i) => (
              <TechCard 
                key={i}
                title={item.title}
                description={item.desc}
                icon={item.icon}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-40 md:py-60 px-4 sm:px-6 md:px-24 section-border text-center overflow-hidden relative">
        <div className="blue-glow bottom-[-50%] left-[50%] -translate-x-1/2 opacity-20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-display text-5xl sm:text-7xl md:text-[140px] mb-8 sm:mb-12 text-white leading-tight">
            Initiate <br /> <span className="text-obscura-blue italic">Transfer.</span>
          </h2>
          <Link href="/vaporize">
            <button className="btn-noir text-base sm:text-2xl px-8 sm:px-20 py-4 sm:py-8">
              Summon Shadows
            </button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
