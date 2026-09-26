import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { DemoToken } from '../types/investigation.js';

interface HeroProps {
  onInvestigate: (address: string) => void;
  isLoading: boolean;
  demoTokens: DemoToken[];
  inputAddress: string;
  setInputAddress: (val: string) => void;
  errorMessage?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  onInvestigate,
  isLoading,
  demoTokens,
  inputAddress,
  setInputAddress,
  errorMessage,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress.trim()) {
      onInvestigate(inputAddress.trim());
    }
  };

  const handleSelectDemo = (token: DemoToken) => {
    setInputAddress(token.address);
    onInvestigate(token.address);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Decorative Circles / Radar Geometry inspired by reference */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute h-[500px] w-[500px] rounded-full bg-[#A8FF4D]/[0.035] blur-[120px]" />
        
        {/* Faint Concentric Circular Outlines */}
        <div className="absolute h-[620px] w-[620px] rounded-full border border-white/[0.03]" />
        <div className="absolute h-[880px] w-[880px] rounded-full border border-white/[0.02]" />
        <div className="absolute h-[1150px] w-[1150px] rounded-full border border-white/[0.015]" />
        
        {/* Technical Coordinate Markers */}
        <div className="absolute top-1/4 left-1/4 h-1 w-1 bg-[#A8FF4D]/40" />
        <div className="absolute top-1/3 right-1/4 h-1 w-1 bg-white/20" />
        <div className="absolute bottom-1/4 left-1/3 h-1 w-1 bg-[#A8FF4D]/30" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Label / Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#0E0E0E]/90 px-3.5 py-1 text-[11px] uppercase tracking-widest text-[#8C8C8C] mb-8">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#A8FF4D] animate-pulse" />
          <span>Base L2 On-Chain Risk Inspector</span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#F5F5F2] leading-[1.08] max-w-4xl mx-auto">
          See the{' '}
          <span className="relative inline-block text-[#A8FF4D] font-medium">
            signals
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#A8FF4D]/40 rounded-full" />
          </span>{' '}
          before you interact.
        </h1>

        {/* Supporting Text */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#8C8C8C] leading-relaxed font-light">
          SCAMSIGNAL investigates observable token and contract signals on Base and explains what they could mean before you execute a transaction.
        </p>

        {/* Core Principles Pill Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] uppercase tracking-wider text-[#8C8C8C]">
          <span className="rounded-md border border-[#1A1A1A] bg-[#0A0A0A] px-2.5 py-1 text-white/90">
            Evidence First
          </span>
          <span className="text-[#1A1A1A]">•</span>
          <span className="rounded-md border border-[#1A1A1A] bg-[#0A0A0A] px-2.5 py-1 text-white/90">
            Explanation Second
          </span>
          <span className="text-[#1A1A1A]">•</span>
          <span className="rounded-md border border-[#1A1A1A] bg-[#0A0A0A] px-2.5 py-1 text-[#A8FF4D]">
            Zero Hallucinated Accusations
          </span>
        </div>

        {/* Investigation Input Form */}
        <div id="investigate-input" className="mx-auto mt-10 max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="group relative rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-2 shadow-2xl transition-all focus-within:border-[#A8FF4D]/60 focus-within:shadow-[0_0_30px_rgba(168,255,77,0.12)] hover:border-[#2C2C2C]"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Left Input Field */}
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <Search className="h-5 w-5 text-[#8C8C8C] shrink-0 group-focus-within:text-[#A8FF4D] transition-colors" />
                <div className="flex flex-col flex-1 text-left min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8C8C]">
                    Token Contract (Base)
                  </span>
                  <input
                    type="text"
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    placeholder="Paste a Base token contract address (0x...)"
                    disabled={isLoading}
                    className="w-full bg-transparent font-mono text-sm sm:text-base text-[#F5F5F2] placeholder-[#444444] focus:outline-none overflow-ellipsis"
                  />
                </div>
              </div>

              {/* Chain Badge + Submit Button */}
              <div className="flex items-center gap-2 justify-end px-2 pb-2 sm:pb-0">
                <span className="hidden sm:inline-block rounded-lg border border-[#1A1A1A] bg-[#121212] px-2.5 py-1.5 font-mono text-xs text-[#8C8C8C]">
                  BASE
                </span>
                <button
                  type="submit"
                  disabled={isLoading || !inputAddress.trim()}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#A8FF4D] px-6 py-3 font-display text-sm font-semibold text-black transition-all hover:bg-[#baff6e] hover:shadow-[0_0_20px_rgba(168,255,77,0.35)] disabled:opacity-40 disabled:hover:shadow-none cursor-pointer"
                >
                  <span>{isLoading ? 'Scanning...' : 'Investigate'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-left text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-200">{errorMessage}</p>
                <p className="mt-0.5 text-red-400/80">
                  Ensure you are supplying a contract address deployed on Base (0x followed by 40 hex digits).
                </p>
              </div>
            </div>
          )}

          {/* Example Tokens Selector */}
          <div className="mt-8 text-center">
            <span className="text-xs uppercase tracking-wider text-[#8C8C8C] block mb-3 font-mono">
              Try known Base ecosystem contracts:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {demoTokens.map((token) => (
                <button
                  key={token.address}
                  type="button"
                  onClick={() => handleSelectDemo(token)}
                  disabled={isLoading}
                  className="group relative flex items-center gap-2 rounded-xl border border-[#1A1A1A] bg-[#0E0E0E] px-3.5 py-2 text-xs transition-all hover:border-[#A8FF4D]/50 hover:bg-[#141414] focus:outline-none"
                >
                  <span className="font-semibold text-[#F5F5F2] group-hover:text-[#A8FF4D]">
                    {token.symbol}
                  </span>
                  <span className="text-[11px] text-[#8C8C8C] max-w-[140px] truncate">
                    {token.name}
                  </span>
                  <span className="rounded bg-[#1A1A1A] px-1.5 py-0.5 font-mono text-[9px] text-[#A8FF4D]/80">
                    {token.address.slice(0, 4)}...{token.address.slice(-4)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
