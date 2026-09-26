import React from 'react';
import { XCircle, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 border-t border-[#141414] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A8FF4D]">
            03 • Scientific Due Diligence
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal text-[#F5F5F2] mt-2">
            Why we do not produce fake safety scores
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8C8C8C] font-light leading-relaxed">
            Crypto security is not a percentage. "92% safe" is mathematical fiction that misleads users. SCAMSIGNAL focuses strictly on verifiable signals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* BAD APPROACH */}
          <div className="rounded-2xl border border-red-950/60 bg-red-950/10 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <XCircle className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                Unhelpful / Flawed Paradigm
              </span>
            </div>
            <div className="rounded-xl border border-red-900/40 bg-black/60 p-4 font-mono text-sm text-red-200">
              "This token is a 100% scam."
            </div>
            <p className="mt-4 text-xs sm:text-sm text-[#8C8C8C] font-light leading-relaxed">
              Unsupported claims damage credibility and produce dangerous false alarms or legal liability. Many legitimate protocols feature owner addresses or pause functions for legitimate operational safety.
            </p>
          </div>

          {/* GOOD APPROACH */}
          <div className="rounded-2xl border border-[#A8FF4D]/30 bg-[#A8FF4D]/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 text-[#A8FF4D]">
              <CheckCircle className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                SCAMSIGNAL Standard
              </span>
            </div>
            <div className="rounded-xl border border-[#A8FF4D]/30 bg-black/60 p-4 font-mono text-sm text-[#A8FF4D]">
              "4 risk signals were detected. These signals do not prove fraud, but warrant additional investigation."
            </div>
            <p className="mt-4 text-xs sm:text-sm text-[#8C8C8C] font-light leading-relaxed">
              Evidence first. Clear differentiation between raw bytecode facts, market depth, and neutral AI interpretations so you can make informed decisions.
            </p>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="rounded-xl border border-[#1A1A1A] bg-[#0E0E0E] p-4">
            <span className="font-mono text-xs text-[#A8FF4D] block mb-1">01</span>
            <span className="font-display text-sm font-medium text-[#F5F5F2] block">Observable Facts</span>
            <span className="text-[11px] text-[#666] font-mono mt-1 block">RPC bytecode & AMM</span>
          </div>
          <div className="rounded-xl border border-[#1A1A1A] bg-[#0E0E0E] p-4">
            <span className="font-mono text-xs text-[#A8FF4D] block mb-1">02</span>
            <span className="font-display text-sm font-medium text-[#F5F5F2] block">Signal Counts</span>
            <span className="text-[11px] text-[#666] font-mono mt-1 block">No fake % score</span>
          </div>
          <div className="rounded-xl border border-[#1A1A1A] bg-[#0E0E0E] p-4">
            <span className="font-mono text-xs text-[#A8FF4D] block mb-1">03</span>
            <span className="font-display text-sm font-medium text-[#F5F5F2] block">Gemini Synthesis</span>
            <span className="text-[11px] text-[#666] font-mono mt-1 block">Zero hallucination</span>
          </div>
          <div className="rounded-xl border border-[#1A1A1A] bg-[#0E0E0E] p-4">
            <span className="font-mono text-xs text-[#A8FF4D] block mb-1">04</span>
            <span className="font-display text-sm font-medium text-[#F5F5F2] block">Clear Uncertainty</span>
            <span className="text-[11px] text-[#666] font-mono mt-1 block">Explicit missing data</span>
          </div>
        </div>
      </div>
    </section>
  );
};
