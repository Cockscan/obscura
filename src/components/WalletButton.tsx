"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { useState } from "react";

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => disconnect()}
          className="font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
        <div className="px-4 py-2 border border-white/20 rounded-full font-mono text-[11px] text-white uppercase tracking-widest">
          {truncateAddress(publicKey.toBase58())}
        </div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => setVisible(true)}
      className="px-6 py-2 border border-white rounded-full text-white font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Connect
    </motion.button>
  );
}
