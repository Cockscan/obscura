"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getVaporAddressesForWallet, StoredVaporAddress } from "@/lib/storage";

export default function HistoryPage() {
  const { publicKey, connected } = useWallet();
  const [vaporAddresses, setVaporAddresses] = useState<StoredVaporAddress[]>([]);

  // Load vapor addresses from localStorage when wallet connects
  useEffect(() => {
    if (publicKey) {
      const addresses = getVaporAddressesForWallet(publicKey.toBase58());
      setVaporAddresses(addresses);
    } else {
      setVaporAddresses([]);
    }
  }, [publicKey]);

  const truncate = (str: string, start = 6, end = 6) => {
    if (str.length <= start + end + 3) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  // Calculate totals
  const depositedAddresses = vaporAddresses.filter(a => a.status === 'deposited' || a.status === 'condensed');
  const condensedAddresses = vaporAddresses.filter(a => a.status === 'condensed');
  
  const totalDeposited = depositedAddresses.reduce((sum, a) => sum + (a.amount || 0), 0);
  const totalCondensed = condensedAddresses.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <main className="min-h-screen flex flex-col pb-32">
      <Navbar />
      
      <div className="pt-28 sm:pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 sm:mb-20">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-obscura-smoke mb-4 block">
              Historical Record
            </span>
            <h1 className="text-display text-4xl sm:text-6xl md:text-8xl text-white italic mb-6">
              Shadow Ledger
            </h1>
            <div className="space-y-6 max-w-2xl">
              <p className="text-white/90 text-xl font-body leading-relaxed">
                An immutable record of your protocol interactions. Due to Obscura's architecture, <span className="text-obscura-blue font-bold">these transactions are untraceable</span> to any external observer.
              </p>
              
              <div className="bg-white/[0.02] border border-white/10 p-6">
                <h4 className="font-mono text-[10px] text-obscura-blue uppercase tracking-widest mb-4">// LEGEND</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500"></div>
                    <span className="text-white/70 text-xs font-body">Pending deposit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500"></div>
                    <span className="text-white/70 text-xs font-body">Deposit confirmed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-obscura-blue"></div>
                    <span className="text-white/70 text-xs font-body">Condensed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {!connected ? (
            <div className="noir-card p-12 text-center border-dashed">
              <h3 className="font-display text-3xl text-white italic">Authentication Required</h3>
              <p className="text-obscura-smoke mt-4">Connect your wallet to view your transaction history.</p>
            </div>
          ) : vaporAddresses.length === 0 ? (
            <div className="noir-card p-12 text-center border-dashed">
              <div className="w-16 h-16 mx-auto mb-6 border border-obscura-blue/30 flex items-center justify-center">
                <Clock className="w-8 h-8 text-obscura-blue/50" />
              </div>
              <h3 className="font-display text-3xl text-white italic mb-4">No History Yet</h3>
              <p className="text-obscura-smoke mb-8 font-light max-w-md mx-auto">
                Your transaction history will appear here once you generate vapor addresses and make deposits.
              </p>
              <a href="/vaporize" className="btn-noir inline-flex">
                Get Started
              </a>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="noir-card p-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-obscura-smoke block mb-4">Cumulative Dissolved</span>
                  <div className="text-display text-4xl text-white italic">{totalDeposited.toFixed(2)} SOL</div>
                </div>
                <div className="noir-card p-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-obscura-smoke block mb-4">Cumulative Materialized</span>
                  <div className="text-display text-4xl text-white italic">{totalCondensed.toFixed(2)} SOL</div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="noir-card overflow-hidden hidden sm:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-obscura-smoke">
                      <th className="p-4 sm:p-6">Status</th>
                      <th className="p-4 sm:p-6">Vapor Address</th>
                      <th className="p-4 sm:p-6">Created</th>
                      <th className="p-4 sm:p-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-sm">
                    {vaporAddresses.map((addr) => (
                      <tr key={addr.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 ${
                              addr.status === 'condensed' ? 'bg-obscura-blue' :
                              addr.status === 'deposited' ? 'bg-green-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <span className="text-white/80 uppercase tracking-widest text-xs">
                              {addr.status === 'condensed' ? 'Condensed' :
                               addr.status === 'deposited' ? 'Deposited' :
                               'Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 text-white font-mono">{truncate(addr.vaporAddress)}</td>
                        <td className="p-4 sm:p-6 text-white/50 text-xs">
                          {new Date(addr.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 sm:p-6 text-right">
                          {addr.amount ? (
                            <span className="text-white font-display text-lg italic">{addr.amount} SOL</span>
                          ) : (
                            <span className="text-white/30 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4">
                {vaporAddresses.map((addr) => (
                  <div key={addr.id} className="noir-card p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${
                          addr.status === 'condensed' ? 'bg-obscura-blue' :
                          addr.status === 'deposited' ? 'bg-green-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-white/80 uppercase tracking-widest text-[10px] font-mono">
                          {addr.status === 'condensed' ? 'Condensed' :
                           addr.status === 'deposited' ? 'Deposited' :
                           'Pending'}
                        </span>
                      </div>
                      {addr.amount ? (
                        <span className="text-white font-display text-xl italic">{addr.amount} SOL</span>
                      ) : (
                        <span className="text-white/30 text-xs">—</span>
                      )}
                    </div>
                    <div className="font-mono text-sm text-white mb-2">{truncate(addr.vaporAddress, 10, 10)}</div>
                    <div className="text-white/40 text-xs">{new Date(addr.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
