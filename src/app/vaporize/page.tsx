"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, QrCode, RefreshCw, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QRCodeSVG } from "qrcode.react";
import { generateVaporAddress as generateRealVaporAddress } from "@/lib/vaporAddress";
import { saveVaporAddress, getVaporAddressesForWallet, StoredVaporAddress } from "@/lib/storage";

interface VaporAddress {
  address: string;
  secret: string;
  recipient: string;
  createdAt: Date;
  storageId?: string;
}

export default function VaporizePage() {
  const { publicKey, connected } = useWallet();
  const [isGenerating, setIsGenerating] = useState(false);
  const [vaporAddresses, setVaporAddresses] = useState<VaporAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<VaporAddress | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVaporAddress = async () => {
    if (!publicKey) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate real vapor address using cryptographic derivation
      const result = await generateRealVaporAddress(publicKey.toBase58());
      
      if (!result) {
        setError("Failed to generate vapor address. Please try again.");
        setIsGenerating(false);
        return;
      }
      
      // Save to localStorage for later retrieval on Condense page
      const stored = saveVaporAddress({
        vaporAddress: result.address,
        recipientAddress: result.recipient,
        secretHex: result.secretHex,
      });
      
      const newAddress: VaporAddress = {
        address: result.address,
        secret: result.secretHex,
        recipient: result.recipient,
        createdAt: new Date(),
        storageId: stored.id,
      };
      
      setVaporAddresses(prev => [newAddress, ...prev]);
      setSelectedAddress(newAddress);
    } catch (err) {
      console.error("Generation error:", err);
      setError("An error occurred during address generation.");
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const truncate = (str: string, start = 8, end = 8) => {
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  return (
    <main className="min-h-screen flex flex-col pb-32">
      <Navbar />
      
      <div className="pt-28 sm:pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 sm:mb-16"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-obscura-smoke mb-4 block">
              Protocol Phase 01
            </span>
            <h1 className="text-display text-4xl sm:text-6xl md:text-8xl text-white italic mb-6">
              Dissolution
            </h1>
            <div className="space-y-6 max-w-2xl">
              <p className="text-white/90 text-xl font-body leading-relaxed">
                To receive tokens privately, you must first dissolve your identity into a <span className="text-obscura-blue font-bold">Vapor Address</span>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-8 sm:py-12">
                {[
                  { step: "01", title: "Connect", desc: "Link your destination wallet to begin the derivation process." },
                  { step: "02", title: "Derive", desc: "Summon a unique, unspendable address from the Edwards curve." },
                  { step: "03", title: "Preserve", desc: "Save your Secret Key. Funds cannot be materialized without it." }
                ].map((s, i) => (
                  <div key={i} className="relative noir-card p-6 sm:p-8 bg-white/[0.03] border-white/10 group hover:border-obscura-blue/40 transition-all">
                    {/* Tech Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-obscura-blue/50"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-obscura-blue/50"></div>
                    
                    <span className="font-mono text-obscura-blue text-sm mb-3 sm:mb-4 block tracking-[0.2em] font-bold">{s.step}</span>
                    <h4 className="font-display text-white text-lg sm:text-xl uppercase mb-2 sm:mb-3 italic tracking-tighter">{s.title}</h4>
                    <p className="text-white/70 text-sm leading-relaxed font-body">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-12">
            {!connected ? (
              <div className="noir-card p-12 text-center border-dashed">
                <h3 className="font-display text-3xl text-white italic mb-4">Awaiting Connection</h3>
                <p className="text-obscura-smoke mb-8 font-light">The protocol requires a destination witness to begin address derivation.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Generate Action */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12 noir-card">
                  <div>
                    <h3 className="text-display text-3xl text-white italic mb-2">Summon Address</h3>
                    <p className="text-obscura-smoke text-sm font-light">Derived from: {truncate(publicKey?.toBase58() || "")}</p>
                  </div>
                  
                  <motion.button
                    onClick={handleGenerateVaporAddress}
                    disabled={isGenerating}
                    className="btn-noir text-sm uppercase tracking-widest disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isGenerating ? "Deriving..." : "Generate"}
                  </motion.button>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 border border-red-500/50 bg-red-500/10 flex items-center gap-4"
                    >
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <p className="text-red-300 font-mono text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result Display */}
                <AnimatePresence>
                  {selectedAddress && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="noir-card p-8 md:p-12">
                        <div className="flex justify-between items-start mb-12">
                          <h4 className="font-mono text-xs uppercase tracking-widest text-obscura-smoke">
                            Active Vapor Address
                          </h4>
                          <button 
                            onClick={() => setShowQR(!showQR)}
                            className="text-obscura-smoke hover:text-white transition-colors"
                          >
                            <QrCode className="w-5 h-5" />
                          </button>
                        </div>

                        {/* QR Code Display */}
                        <AnimatePresence>
                          {showQR && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex justify-center mb-8"
                            >
                              <div className="bg-white p-6 rounded-lg">
                                <QRCodeSVG 
                                  value={`solana:${selectedAddress.address}`}
                                  size={200}
                                  level="H"
                                  includeMargin={false}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-8">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 group">
                            <div className="flex-1 font-mono text-sm sm:text-lg md:text-xl text-white bg-black/60 p-4 sm:p-8 rounded border border-obscura-blue/40 shadow-[0_0_30px_rgba(0,212,255,0.1)] break-all">
                              <span className="text-obscura-blue/50 text-[10px] uppercase block mb-2 font-mono tracking-widest">Public_Vapor_Address</span>
                              {selectedAddress.address}
                            </div>
                            <button
                              onClick={() => copyToClipboard(selectedAddress.address, "address")}
                              className="p-4 sm:p-6 noir-card bg-white text-black hover:bg-obscura-blue transition-all self-end sm:self-auto"
                            >
                              {copied === "address" ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Copy className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </button>
                          </div>

                          <div className="p-8 border-2 border-white/20 bg-white/[0.05] relative overflow-hidden">
                            {/* Warning Pulse */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-obscura-blue animate-pulse" />
                            
                            <div className="flex gap-6">
                              <Info className="w-8 h-8 text-white shrink-0" />
                              <div className="flex-1">
                                <h5 className="font-display text-xl uppercase text-white mb-2 italic">Critical: Secret Key</h5>
                                <p className="text-white/80 text-sm mb-6 font-body leading-relaxed">
                                  This is your only key to reclaim tokens. Obscura does not store this. <span className="text-white font-bold underline">If lost, your funds are gone forever.</span>
                                </p>
                                <div className="flex items-center gap-4 bg-black/80 p-4 border border-white/10">
                                  <code className="flex-1 font-mono text-sm text-white break-all">
                                    {selectedAddress.secret}
                                  </code>
                                  <button 
                                    onClick={() => copyToClipboard(selectedAddress.secret, "secret")}
                                    className="p-2 bg-white text-black hover:bg-obscura-blue transition-all"
                                  >
                                    {copied === "secret" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
