import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Terminal 
} from 'lucide-react';
import { RiskSignal, SignalSeverity } from '../types/investigation.js';

interface SignalCardProps {
  signal: RiskSignal;
  index: number;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, index }) => {
  const [showTechnical, setShowTechnical] = useState(false);

  // Restrained semantic badges
  const getSeverityBadge = (severity: SignalSeverity) => {
    switch (severity) {
      case 'HIGH ATTENTION':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            High Attention
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A8FF4D]/40 bg-[#A8FF4D]/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#A8FF4D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF4D]" />
            Attention
          </span>
        );
      case 'INFORMATIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
            <Info className="h-3 w-3 text-zinc-400" />
            Informational
          </span>
        );
      case 'CLEAR / NO SIGNAL DETECTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A8FF4D]/30 bg-[#A8FF4D]/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#A8FF4D]">
            <CheckCircle className="h-3 w-3 text-[#A8FF4D]" />
            Clear / Standard
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#222] bg-[#141414] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#888]">
            <HelpCircle className="h-3 w-3 text-[#888]" />
            Unverified / Unknown
          </span>
        );
    }
  };

  const hasTechnicalData = Boolean(
    (signal.technicalDetails?.methodSelectors && signal.technicalDetails.methodSelectors.length > 0) ||
    signal.technicalDetails?.rawData
  );

  return (
    <div className="rounded-2xl border border-[#1A1A1A] bg-[#0E0E0E] p-6 transition-all hover:border-[#282828] relative">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A1A1A] pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8C8C8C]">
            {signal.categoryLabel}
          </span>
        </div>
        <div>{getSeverityBadge(signal.severity)}</div>
      </div>

      {/* Main Title & Content */}
      <div className="mt-4">
        <h3 className="font-display text-lg sm:text-xl font-medium text-[#F5F5F2]">
          {signal.title}
        </h3>

        {/* Section: WHAT WE FOUND */}
        <div className="mt-4 rounded-xl border border-[#161616] bg-[#080808] p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8C8C] block mb-1">
            What We Found
          </span>
          <p className="text-sm text-[#D8D8D4] leading-relaxed font-light">
            {signal.whatWasFound}
          </p>
        </div>

        {/* Section: WHY IT MATTERS */}
        <div className="mt-3 rounded-xl border border-[#161616] bg-[#080808] p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8FF4D]/90 block mb-1">
            Why It Matters
          </span>
          <p className="text-sm text-[#B4B4AF] leading-relaxed font-light">
            {signal.whyItMatters}
          </p>
        </div>

        {/* Evidence List */}
        {signal.evidence && signal.evidence.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#666] block">
              Observed Evidence Trail
            </span>
            <div className="grid grid-cols-1 gap-2">
              {signal.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-[#141414] bg-[#0B0B0B] px-3.5 py-2.5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-[#8C8C8C] shrink-0 font-semibold">{item.source}:</span>
                    <span className="text-[#F5F5F2] truncate">{item.observedValue}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <span className="text-[#888] font-sans italic">{item.interpretation}</span>
                    <span className="rounded bg-[#1A1A1A] px-2 py-0.5 text-[#A8FF4D]">
                      Confidence: {item.confidence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Technical Details */}
        {hasTechnicalData && (
          <div className="mt-4 border-t border-[#161616] pt-3">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="flex items-center gap-1.5 text-xs font-mono text-[#8C8C8C] hover:text-[#A8FF4D] transition-colors focus:outline-none"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>{showTechnical ? 'Hide technical details' : 'Show technical details'}</span>
              {showTechnical ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showTechnical && (
              <div className="mt-3 rounded-xl border border-[#1F1F1F] bg-[#050505] p-3 text-xs font-mono text-[#AAA] overflow-x-auto">
                {signal.technicalDetails?.methodSelectors && (
                  <div className="mb-2">
                    <span className="text-[10px] uppercase text-[#666] block mb-1">
                      Matched Bytecode Function Selectors:
                    </span>
                    <ul className="space-y-1">
                      {signal.technicalDetails.methodSelectors.map((sel, sIdx) => (
                        <li key={sIdx} className="text-[#A8FF4D]/90">
                          {sel}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {signal.technicalDetails?.rawData && (
                  <div>
                    <span className="text-[10px] uppercase text-[#666] block mb-1">
                      Raw Category Payload:
                    </span>
                    <pre className="text-[11px] text-[#888] leading-tight overflow-x-auto">
                      {JSON.stringify(signal.technicalDetails.rawData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
