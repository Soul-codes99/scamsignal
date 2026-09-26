import React from 'react';
import { ShieldAlert, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onNavigateSection: (id: string) => void;
  hasActiveReport: boolean;
  activeAddress?: string | null;
  activeSymbol?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onReset, 
  onNavigateSection, 
  hasActiveReport,
  activeAddress,
  activeSymbol
}) => {
  const [copiedNav, setCopiedNav] = React.useState(false);

  const handleCopyNav = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      setCopiedNav(true);
      setTimeout(() => setCopiedNav(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1A1A1A] bg-[#050505]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button 
          onClick={onReset}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#A8FF4D]/30 bg-[#A8FF4D]/10 text-[#A8FF4D] transition-transform group-hover:scale-105">
            <span className="font-mono text-sm font-bold">✳</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-[#F5F5F2] transition-colors group-hover:text-[#A8FF4D]">
              SCAMSIGNAL
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#8C8C8C]">
              Base Risk Intelligence
            </span>
          </div>
        </button>

        {/* Center Nav Links or Active Token in Header */}
        {hasActiveReport && activeAddress ? (
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] px-3 py-1.5 transition-all hover:border-[#2C2C2C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF4D]" />
            <span className="text-xs font-medium text-[#F5F5F2]">
              {activeSymbol ? `${activeSymbol} Contract:` : 'Contract:'}
            </span>
            <span className="font-mono text-xs text-[#8C8C8C]">
              {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
            </span>
            <button
              onClick={handleCopyNav}
              title="Copy contract address to clipboard"
              className="ml-1 inline-flex items-center gap-1 rounded-md border border-[#222] bg-[#141414] px-2 py-0.5 text-[11px] font-mono text-[#AAA] hover:border-[#A8FF4D]/40 hover:bg-[#1A1A1A] hover:text-[#A8FF4D] transition-all cursor-pointer"
            >
              {copiedNav ? (
                <>
                  <Check className="h-3 w-3 text-[#A8FF4D]" />
                  <span className="text-[#A8FF4D]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-[#8C8C8C]">
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="transition-colors hover:text-[#F5F5F2]"
            >
              How it works
            </button>
            <button
              onClick={() => onNavigateSection('signals')}
              className="transition-colors hover:text-[#F5F5F2]"
            >
              Signals
            </button>
            <button
              onClick={() => onNavigateSection('philosophy')}
              className="transition-colors hover:text-[#F5F5F2]"
            >
              Philosophy
            </button>
            <a
              href="https://base.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-[#F5F5F2]"
            >
              Base Network
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </nav>
        )}

        {/* Right CTA / Chain Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#0E0E0E] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF]" />
            <span className="font-mono text-[11px] text-[#8C8C8C]">BASE L2 (8453)</span>
          </div>

          {hasActiveReport ? (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#A8FF4D]/40 bg-[#A8FF4D]/10 px-4 py-1.5 text-xs font-medium text-[#A8FF4D] transition-colors hover:bg-[#A8FF4D]/20"
            >
              New Investigation
            </button>
          ) : (
            <button
              onClick={() => onNavigateSection('investigate-input')}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#A8FF4D] bg-[#A8FF4D] px-4 py-1.5 text-xs font-semibold text-black transition-all hover:bg-[#baff6e] hover:shadow-[0_0_15px_rgba(168,255,77,0.3)]"
            >
              Investigate
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
