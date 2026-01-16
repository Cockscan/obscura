"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, Clock, Shuffle, AlertTriangle, Plus,
  Check, Loader2, SplitSquareHorizontal, Layers, Trash2, Download
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  getVaporAddressesForWallet, 
  updateVaporAddress, 
  markAsCondensed,
  StoredVaporAddress,
  exportVaporAddresses
} from "@/lib/storage";

type WithdrawStrategy = "instant" | "split" | "batch";

export default function CondensePage() {
  const { publicKey, connected } = useWallet();
  const [vaporAddresses, setVaporAddresses] = useState<StoredVaporAddress[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [strategy, setStrategy] = useState<WithdrawStrategy>("instant");
  const [isCondensing, setIsCondensing] = useState(false);
  const [condensingStep, setCondensingStep] = useState(0);
  const [showAmountModal, setShowAmountModal] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");

  // Load vapor addresses from localStorage when wallet connects
  useEffect(() => {
    if (publicKey) {
      const addresses = getVaporAddressesForWallet(publicKey.toBase58());
      // Only show pending or deposited (not already condensed)
      const active = addresses.filter(a => a.status !== 'condensed');
      setVaporAddresses(active);
    } else {
      setVaporAddresses([]);
    }
  }, [publicKey]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedAddresses = vaporAddresses.filter(a => selectedIds.has(a.id));
  const totalAmount = selectedAddresses.reduce((sum, a) => sum + (a.amount || 0), 0);

  const handleSetAmount = (id: string) => {
    const amount = parseFloat(amountInput);
    if (!isNaN(amount) && amount > 0) {
      updateVaporAddress(id, { amount, status: 'deposited' });
      setVaporAddresses(prev => prev.map(a => 
        a.id === id ? { ...a, amount, status: 'deposited' as const } : a
      ));
    }
    setShowAmountModal(null);
    setAmountInput("");
  };

  const handleCondense = async () => {
    if (selectedAddresses.length === 0 || totalAmount === 0) return;
    
    setIsCondensing(true);
    
    // Simulate ZK proof generation steps
    const steps = [
      "Loading witness data",
      "Generating ZK circuit",
      "Computing proof",
      "Verifying locally",
      "Submitting to chain"
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setCondensingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Mark selected as condensed
    for (const addr of selectedAddresses) {
      markAsCondensed(addr.id);
    }
    
    // Remove from display
    setVaporAddresses(prev => prev.filter(a => !selectedIds.has(a.id)));
    setSelectedIds(new Set());
    setIsCondensing(false);
  };

  const handleExportBackup = () => {
    const data = exportVaporAddresses();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obscura-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const truncate = (str: string, start = 6, end = 6) => {
    if (str.length <= start + end + 3) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  const strategies = [
    { id: "instant" as const, icon: Zap, title: "Instant", desc: "Standard unlinkability. Immediate settlement." },
    { id: "split" as const, icon: SplitSquareHorizontal, title: "Split", desc: "Enhanced entropy. Randomizes amounts." },
    { id: "batch" as const, icon: Layers, title: "Batch", desc: "Maximum anonymity. Severance through delay." },
  ];

  return (
    <main className="min-h-screen flex flex-col pb-32">
      <Navbar />
      
      <div className="pt-28 sm:pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-obscura-smoke mb-4 block">
              Protocol Phase 02
            </span>
            <h1 className="text-display text-4xl sm:text-6xl md:text-8xl text-white italic mb-6">
              Materialization
            </h1>
            <div className="space-y-6 max-w-2xl">
              <p className="text-white/90 text-xl font-body leading-relaxed">
                Break the link. Reclaim your dissolved tokens into your sovereign wallet using <span className="text-obscura-blue font-bold">Zero-Knowledge proofs</span>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-8 sm:py-12">
                {[
                  { step: "01", title: "Identify", desc: "Your vapor addresses appear here after deposits are confirmed." },
                  { step: "02", title: "Strategize", desc: "Choose your privacy level: Instant, Split, or Batch & Delay." },
                  { step: "03", title: "Synthesize", desc: "Generate the ZK-proof and materialize your tokens on-chain." }
                ].map((s, i) => (
                  <div key={i} className="relative noir-card p-8 bg-white/[0.03] border-white/10 group hover:border-obscura-blue/40 transition-all">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-obscura-blue/50"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-obscura-blue/50"></div>
                    
                    <span className="font-mono text-obscura-blue text-sm mb-4 block tracking-[0.2em] font-bold">{s.step}</span>
                    <h4 className="font-display text-white text-xl uppercase mb-3 italic tracking-tighter">{s.title}</h4>
                    <p className="text-white/70 text-sm leading-relaxed font-body">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {!connected ? (
            <div className="noir-card p-12 text-center border-dashed">
              <h3 className="font-display text-3xl text-white italic mb-4">Secure Link Required</h3>
              <p className="text-obscura-smoke mb-8 font-light">The condensation process requires a validated destination wallet.</p>
            </div>
          ) : vaporAddresses.length === 0 ? (
            <div className="noir-card p-12 text-center border-dashed">
              <div className="w-16 h-16 mx-auto mb-6 border border-obscura-blue/30 flex items-center justify-center">
                <Clock className="w-8 h-8 text-obscura-blue/50" />
              </div>
              <h3 className="font-display text-3xl text-white italic mb-4">No Pending Evidence</h3>
              <p className="text-obscura-smoke mb-8 font-light max-w-md mx-auto">
                You have no vapor addresses waiting for condensation. Generate a vapor address on the Vaporize page first, then send tokens to it.
              </p>
              <a href="/vaporize" className="btn-noir inline-flex">
                <Plus className="w-4 h-4" />
                Generate Vapor Address
              </a>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Vapor Addresses List */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-obscura-smoke flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Your Vapor Addresses
                  </h2>
                  <button 
                    onClick={handleExportBackup}
                    className="text-obscura-smoke hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
                  >
                    <Download className="w-4 h-4" />
                    Backup
                  </button>
                </div>

                <div className="space-y-4">
                  {vaporAddresses.map((addr) => (
                    <motion.div
                      key={addr.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative noir-card overflow-hidden transition-all ${
                        selectedIds.has(addr.id) ? "border-obscura-blue bg-obscura-blue/5" : "border-white/10"
                      }`}
                    >
                      {/* Status indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        addr.status === 'deposited' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      
                      <div className="p-6 pl-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="font-mono text-[10px] text-obscura-smoke uppercase tracking-widest block mb-1">
                              {addr.status === 'deposited' ? 'Deposit Confirmed' : 'Awaiting Deposit'}
                            </span>
                            <code className="font-mono text-lg text-white">{truncate(addr.vaporAddress)}</code>
                          </div>
                          
                          {addr.amount ? (
                            <div className="text-right">
                              <span className="text-display text-3xl text-white italic">{addr.amount}</span>
                              <span className="text-obscura-smoke ml-2 text-sm">SOL</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAmountModal(addr.id)}
                              className="px-4 py-2 border border-obscura-blue/50 text-obscura-blue text-xs font-mono hover:bg-obscura-blue/10 transition-all"
                            >
                              + Set Amount
                            </button>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] text-obscura-smoke">
                            Created: {new Date(addr.createdAt).toLocaleDateString()}
                          </span>
                          
                          {addr.amount && addr.amount > 0 && (
                            <button
                              onClick={() => toggleSelection(addr.id)}
                              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                                selectedIds.has(addr.id)
                                  ? 'bg-obscura-blue text-black'
                                  : 'border border-white/20 text-white hover:border-white'
                              }`}
                            >
                              {selectedIds.has(addr.id) ? '✓ Selected' : 'Select'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Warning */}
                <div className="p-6 border border-yellow-500/30 bg-yellow-500/5 flex gap-4 mt-8">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="font-display text-lg text-white mb-2">Backup Your Secrets</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Your vapor address secrets are stored locally in this browser. Use the backup button to export them. 
                      <span className="text-yellow-400 font-bold"> If you clear browser data, your secrets are lost forever.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="lg:col-span-5">
                <div className="noir-card p-8 sticky top-32">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-obscura-smoke mb-8">Strategy</h2>
                  
                  <div className="space-y-4 mb-12">
                    {strategies.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStrategy(s.id)}
                        className={`w-full p-6 text-left border transition-all ${
                          strategy === s.id ? "border-obscura-blue bg-obscura-blue/5" : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <s.icon className={`w-5 h-5 ${strategy === s.id ? 'text-obscura-blue' : 'text-white/50'}`} />
                          <h4 className="font-display text-xl text-white italic">{s.title}</h4>
                        </div>
                        <p className="text-obscura-smoke text-xs font-light">{s.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline mb-8 p-4 bg-white/5">
                    <span className="font-mono text-xs text-obscura-smoke uppercase">Total Selected</span>
                    <div>
                      <span className="text-display text-4xl text-white italic">{totalAmount.toFixed(2)}</span>
                      <span className="text-obscura-smoke ml-2">SOL</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCondense}
                    disabled={isCondensing || totalAmount === 0 || selectedIds.size === 0}
                    className="btn-noir w-full justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isCondensing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isCondensing ? "Synthesizing..." : "Condense"}
                  </button>

                  {selectedIds.size === 0 && totalAmount === 0 && vaporAddresses.length > 0 && (
                    <p className="text-obscura-smoke text-xs text-center mt-4">
                      Set amounts and select addresses to condense
                    </p>
                  )}

                  <AnimatePresence>
                    {isCondensing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-3">
                        {["Loading witness data", "Generating ZK circuit", "Computing proof", "Verifying locally", "Submitting to chain"].map((s, i) => (
                          <div key={i} className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
                            <div className={`w-2 h-2 rounded-full transition-all ${
                              i < condensingStep ? "bg-green-500" : 
                              i === condensingStep ? "bg-obscura-blue animate-pulse" : 
                              "bg-white/20"
                            }`} />
                            <span className={
                              i < condensingStep ? "text-green-500" : 
                              i === condensingStep ? "text-obscura-blue" : 
                              "text-white/20"
                            }>{s}</span>
                            {i < condensingStep && <Check className="w-3 h-3 text-green-500 ml-auto" />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Amount Input Modal */}
      <AnimatePresence>
        {showAmountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowAmountModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="noir-card p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-display text-2xl text-white italic mb-2">Confirm Deposit</h3>
              <p className="text-obscura-smoke text-sm mb-6">
                Enter the amount you sent to this vapor address. This should match the actual transfer amount.
              </p>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/20 px-4 py-3 font-mono text-xl text-white focus:border-obscura-blue focus:outline-none"
                />
                <span className="text-obscura-smoke text-xl self-center">SOL</span>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAmountModal(null)}
                  className="flex-1 py-3 border border-white/20 text-white font-mono text-sm uppercase hover:border-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSetAmount(showAmountModal)}
                  disabled={!amountInput || parseFloat(amountInput) <= 0}
                  className="flex-1 py-3 bg-obscura-blue text-black font-mono text-sm uppercase disabled:opacity-30"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
