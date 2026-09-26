import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, CircleDashed, Copy, Check } from 'lucide-react';

interface LoadingScannerProps {
  targetAddress: string;
}

const STAGES = [
  { step: '01', title: 'Contract Bytecode & Privileges', desc: 'Querying Base RPC for admin selectors and owner parameters' },
  { step: '02', title: 'Holder Distribution & Pools', desc: 'Analyzing top wallet concentration and AMM reserves' },
  { step: '03', title: 'Liquidity Depth & Lock Status', desc: 'Inspecting DexScreener pair depth and lock verification registries' },
  { step: '04', title: 'Transfer Behavior & Constraints', desc: 'Checking blacklist, tax fees, pause, and max wallet limits' },
  { step: '05', title: 'Gemini Analytical Synthesis', desc: 'Synthesizing evidence-first report with Gemini 3.8 Flash' },
];

export const LoadingScanner: React.FC<LoadingScannerProps> = ({ targetAddress }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto my-12 max-w-2xl px-4">
      <div className="relative rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Radar beam effect */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#A8FF4D]/10 blur-3xl animate-pulse" />

        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#A8FF4D]/40 bg-[#A8FF4D]/10 text-[#A8FF4D]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A8FF4D] font-mono block">
                Active Investigation
              </span>
              <h3 className="font-display text-lg font-semibold text-[#F5F5F2]">
                Analyzing Base Contract
              </h3>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#8C8C8C]">
                {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy full contract address"
                className="inline-flex items-center rounded border border-[#222] bg-[#141414] p-1 text-[#AAA] hover:border-[#A8FF4D]/40 hover:text-[#A8FF4D] transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-[#A8FF4D]" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <span className="text-[10px] text-[#A8FF4D] font-mono mt-0.5">BASE (8453)</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={stage.step}
                className={`flex items-start gap-4 rounded-xl border p-3.5 transition-all ${
                  isCurrent
                    ? 'border-[#A8FF4D]/40 bg-[#A8FF4D]/[0.03]'
                    : isCompleted
                    ? 'border-[#1A1A1A] bg-[#0E0E0E]/40'
                    : 'border-[#141414] bg-transparent opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-[#A8FF4D]" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 text-[#A8FF4D] animate-spin" />
                  ) : (
                    <CircleDashed className="h-5 w-5 text-[#444]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#8C8C8C]">{stage.step}</span>
                    <h4
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-[#F5F5F2]' : isCompleted ? 'text-[#D0D0CE]' : 'text-[#666]'
                      }`}
                    >
                      {stage.title}
                    </h4>
                  </div>
                  <p className="mt-0.5 text-xs text-[#8C8C8C] truncate font-light">
                    {stage.desc}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider ${
                      isCompleted
                        ? 'text-[#A8FF4D]'
                        : isCurrent
                        ? 'text-white/80 animate-pulse'
                        : 'text-[#444]'
                    }`}
                  >
                    {isCompleted ? 'Complete' : isCurrent ? 'Inspecting' : 'Queued'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="mt-6 pt-4 border-t border-[#141414] text-center">
          <p className="text-[11px] text-[#666] font-mono">
            Direct on-chain RPC inspection • No mock evidence • Base Chain ID 8453
          </p>
        </div>
      </div>
    </div>
  );
};
