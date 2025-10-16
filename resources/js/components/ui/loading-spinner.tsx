import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#000b1b] to-[#001636] text-neon">
      {/* CRT glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1%,transparent_1%)] bg-[length:3px_3px] opacity-40 pointer-events-none" />

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_2px] opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Animated “Loading…” text */}
      <motion.div
        className="font-mono text-2xl md:text-3xl text-[#00ffcc] drop-shadow-[0_0_6px_#00ffcc] tracking-widest mb-6 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        LOADING<span className="animate-pulse">...</span>
      </motion.div>

      {/* Retro spinner / loading bar */}
      <div className="relative w-40 h-3 bg-[#003344] border border-[#00ffcc]/50 rounded-sm overflow-hidden shadow-[0_0_10px_#00ffcc]">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#00ffcc] shadow-[0_0_8px_#00ffcc]"
          initial={{ width: '0%' }}
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
