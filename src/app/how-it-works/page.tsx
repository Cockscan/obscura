"use client";

import { motion } from "framer-motion";
import { Eye, Shield, Zap, Lock, Binary, GitBranch } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Derivation.",
      desc: "Every interaction begins with a Vapor Address. This is not a randomly generated key, but a specific point on the Edwards curve derived from a Poseidon hash of your destination wallet and a secret. Because no scalar exists for this point, it is mathematically unspendable.",
      tech: "P = hash_to_curve(poseidon(recipient || secret))"
    },
    {
      num: "02",
      title: "Accumulation.",
      desc: "Tokens sent to a Vapor Address are indexed by our on-chain Merkle Tree accumulator. This structure allows the protocol to track the state of all vaporized tokens without maintaining a centralized database, ensuring the system remains trustless.",
      tech: "leaf = poseidon(destination, amount)"
    },
    {
      num: "03",
      title: "Synthesis.",
      desc: "To reclaim tokens, your client synthesizes a Zero-Knowledge proof. This proof demonstrates knowledge of a valid leaf in the tree and the secret that derived it, without revealing which leaf is being spent. Your privacy is guaranteed by cryptography.",
      tech: "π = prove(recipient, secret, merkle_proof)"
    },
    {
      num: "04",
      title: "Settlement.",
      desc: "The Condenser verifier on Solana validates your ZK-proof in a single transaction. Upon success, the program mints the corresponding amount of tokens to your destination wallet. The transaction history is severed; the loop is closed.",
      tech: "verify(π) → mint(recipient, amount)"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col pb-32">
      <Navbar />
      
      <div className="pt-40 pb-20 px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-32">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-obscura-smoke mb-4 block">Documentation</span>
            <h1 className="text-display text-7xl md:text-[120px] text-white italic leading-tight">
              The Arcane Arts.
            </h1>
            <p className="text-obscura-smoke max-w-2xl text-xl font-light mt-8 leading-relaxed">
              An exploration of the mathematical architecture that powers Obscura. 
              From elliptic curve derivation to zero-knowledge synthesis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-24">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-t border-white/10 pt-12"
              >
                <div className="flex items-baseline gap-6 mb-8">
                  <span className="text-display text-4xl text-obscura-slate italic">{step.num}</span>
                  <h3 className="text-display text-5xl text-white italic">{step.title}</h3>
                </div>
                <p className="text-obscura-smoke font-light leading-relaxed mb-8 text-lg">
                  {step.desc}
                </p>
                <code className="block bg-white/[0.02] p-4 rounded font-mono text-xs text-obscura-slate border border-white/5">
                  {step.tech}
                </code>
              </motion.div>
            ))}
          </div>

          <div className="mt-40 noir-card p-12 md:p-24 text-center">
            <h2 className="text-display text-5xl md:text-7xl text-white italic mb-8">Ready to disappear?</h2>
            <p className="text-obscura-smoke mb-12 max-w-xl mx-auto font-light">
              Experience the highest level of privacy on Solana. Generate your first 
              vapor address and break the chain today.
            </p>
            <div className="flex justify-center gap-6">
              <button className="btn-noir uppercase tracking-widest text-xs">Enter Protocol</button>
              <button className="btn-outline uppercase tracking-widest text-xs">GitHub Repository</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
