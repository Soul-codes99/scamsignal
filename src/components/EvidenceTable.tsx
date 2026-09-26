import React from 'react';
import { Database, ShieldCheck, ExternalLink } from 'lucide-react';
import { RiskSignal } from '../types/investigation.js';

interface EvidenceTableProps {
  signals: RiskSignal[];
  contractAddress: string;
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({ signals, contractAddress }) => {
  // Aggregate all evidence rows
  const allEvidence = signals.flatMap((sig) => 
    sig.evidence.map((ev) => ({
      category: sig.categoryLabel,
      source: ev.source,
      observedValue: ev.observedValue,
      interpretation: ev.interpretation,
      confidence: ev.confidence,
    }))
  );

  return (
    <div className="rounded-2xl border border-[#1A1A1A] bg-[#0E0E0E] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <Database className="h-4 w-4 text-[#A8FF4D]" />
          <h3 className="font-display text-base font-semibold text-[#F5F5F2]">
            Evidence Trail Ledger
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#8C8C8C]">
            {allEvidence.length} Verifiable Claims
          </span>
          <a
            href={`https://basescan.org/address/${contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded border border-[#1A1A1A] bg-[#050505] px-2 py-1 font-mono text-[10px] text-[#A8FF4D] hover:border-[#A8FF4D]/40"
          >
            <span>BaseScan</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[#1A1A1A] text-[10px] uppercase tracking-wider text-[#666]">
              <th className="py-2.5 pr-4">Category</th>
              <th className="py-2.5 pr-4">Source</th>
              <th className="py-2.5 pr-4">Observed Metric / Signature</th>
              <th className="py-2.5 pr-4">Plain English Interpretation</th>
              <th className="py-2.5 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414] text-[#C4C4BF]">
            {allEvidence.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                <td className="py-3 pr-4 font-sans text-xs text-[#8C8C8C] whitespace-nowrap">
                  {row.category}
                </td>
                <td className="py-3 pr-4 text-[#F5F5F2] font-semibold whitespace-nowrap">
                  {row.source}
                </td>
                <td className="py-3 pr-4 text-[#D8D8D4] max-w-[240px] truncate" title={row.observedValue}>
                  {row.observedValue}
                </td>
                <td className="py-3 pr-4 font-sans text-xs text-[#AAA] max-w-[320px]">
                  {row.interpretation}
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono ${
                      row.confidence === 'High'
                        ? 'border border-[#A8FF4D]/30 bg-[#A8FF4D]/10 text-[#A8FF4D]'
                        : row.confidence === 'Medium'
                        ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border border-zinc-700 bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {row.confidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
