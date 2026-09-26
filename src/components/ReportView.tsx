import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  AlertTriangle,
  Layers,
  FileCode2,
  Lock,
  Coins
} from 'lucide-react';
import { InvestigationReport } from '../types/investigation.js';
import { SignalCard } from './SignalCard.js';
import { EvidenceTable } from './EvidenceTable.js';

interface ReportViewProps {
  report: InvestigationReport;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(report.token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { token, rawEvidence, signals, summary, aiExplanation } = report;

  const totalRisks = summary.totalRiskSignals;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-500">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onReset}
          className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C8C8C] hover:text-[#A8FF4D] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Investigation Search</span>
        </button>

        <span className="font-mono text-xs text-[#666]">
          Report ID: {report.id}
        </span>
      </div>

      {/* Report Header Card */}
      <div className="rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1A1A1A] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md border border-[#A8FF4D]/30 bg-[#A8FF4D]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#A8FF4D]">
                Investigation Report
              </span>
              <span className="rounded-md border border-[#1A1A1A] bg-[#121212] px-2 py-0.5 font-mono text-[10px] text-[#8C8C8C]">
                BASE L2 (8453)
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-normal text-[#F5F5F2] flex items-center gap-3">
              <span>{token.name}</span>
              <span className="font-mono text-base sm:text-xl text-[#8C8C8C] font-normal">
                (${token.symbol})
              </span>
            </h1>

            {/* Contract Address Interactive Bar */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div 
                onClick={copyAddress}
                title="Click to copy contract address"
                className="group flex items-center gap-2 rounded-xl border border-[#1F1F1F] bg-[#0E0E0E] px-3 py-1.5 transition-all hover:border-[#A8FF4D]/40 hover:bg-[#141414] cursor-pointer"
              >
                <span className="text-[10px] font-mono uppercase text-[#666] tracking-wider shrink-0">
                  Contract:
                </span>
                <span className="font-mono text-xs sm:text-sm text-[#E2E2DE] group-hover:text-white select-all break-all sm:break-normal">
                  {token.address}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyAddress();
                  }}
                  title="Copy to Clipboard"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono font-medium transition-all ${
                    copied
                      ? 'border-[#A8FF4D] bg-[#A8FF4D]/20 text-[#A8FF4D] shadow-[0_0_10px_rgba(168,255,77,0.25)]'
                      : 'border-[#262626] bg-[#181818] text-[#AAA] hover:border-[#A8FF4D]/50 hover:bg-[#202020] hover:text-[#A8FF4D]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#A8FF4D]" />
                      <span className="text-[#A8FF4D] font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={token.blockExplorerUrl}
                target="_blank"
                rel="noreferrer"
                title="View on BaseScan"
                className="inline-flex items-center gap-1 rounded-xl border border-[#1F1F1F] bg-[#0E0E0E] px-3 py-1.5 text-xs font-mono text-[#8C8C8C] hover:border-[#A8FF4D]/40 hover:text-[#A8FF4D] transition-all"
              >
                <span>BaseScan</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:text-right shrink-0">
            <div className="rounded-xl border border-[#161616] bg-[#0E0E0E] p-3">
              <span className="text-[10px] font-mono uppercase text-[#666] block">Liquidity</span>
              <span className="font-mono text-sm font-semibold text-[#F5F5F2]">
                {rawEvidence.liquidity.usdAmount !== undefined
                  ? `$${Math.round(rawEvidence.liquidity.usdAmount).toLocaleString()}`
                  : 'Unavailable'}
              </span>
            </div>
            <div className="rounded-xl border border-[#161616] bg-[#0E0E0E] p-3">
              <span className="text-[10px] font-mono uppercase text-[#666] block">Source Code</span>
              <span
                className={`font-mono text-sm font-semibold ${
                  rawEvidence.verification.isVerified ? 'text-[#A8FF4D]' : 'text-amber-400'
                }`}
              >
                {rawEvidence.verification.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-[#161616] bg-[#0E0E0E] p-3">
              <span className="text-[10px] font-mono uppercase text-[#666] block">Total Supply</span>
              <span className="font-mono text-sm font-semibold text-[#F5F5F2] truncate block" title={token.totalSupply}>
                {token.totalSupply}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Signal Summary Banner */}
        <div className="mt-6 rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E] p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-display text-3xl sm:text-4xl font-semibold text-[#A8FF4D]">
                  {totalRisks}
                </span>
                <span className="font-display text-lg sm:text-xl font-medium uppercase tracking-wider text-[#F5F5F2]">
                  {totalRisks === 1 ? 'Risk Signal Detected' : 'Risk Signals Detected'}
                </span>
              </div>
              <p className="text-sm text-[#8C8C8C] font-light max-w-2xl">
                {summary.neutralAssessment}
              </p>
            </div>

            {/* Signal Severity Breakdown Chips */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {summary.keyFindingsCount.highAttention > 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-center font-mono text-xs text-red-300">
                  <span className="font-bold">{summary.keyFindingsCount.highAttention}</span> High Attention
                </div>
              )}
              {summary.keyFindingsCount.attention > 0 && (
                <div className="rounded-lg border border-[#A8FF4D]/30 bg-[#A8FF4D]/10 px-3 py-1 text-center font-mono text-xs text-[#A8FF4D]">
                  <span className="font-bold">{summary.keyFindingsCount.attention}</span> Attention
                </div>
              )}
              {summary.keyFindingsCount.clear > 0 && (
                <div className="rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-1 text-center font-mono text-xs text-zinc-300">
                  <span className="font-bold">{summary.keyFindingsCount.clear}</span> Standard / Clear
                </div>
              )}
              {summary.keyFindingsCount.unknown > 0 && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-center font-mono text-xs text-zinc-500">
                  <span className="font-bold">{summary.keyFindingsCount.unknown}</span> Inconclusive
                </div>
              )}
            </div>
          </div>

          {/* Uncertainty Callout if applicable */}
          {summary.uncertainties && summary.uncertainties.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#181818] flex items-center gap-2 text-xs text-[#777] font-mono">
              <Info className="h-3.5 w-3.5 text-[#A8FF4D]/70 shrink-0" />
              <span>Note: {summary.uncertainties.join(' ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Investigation Cards */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-[#F5F5F2]">
            Detailed Observable Signals
          </h2>
          <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-mono">
            5 Core Categories
          </span>
        </div>

        <div className="space-y-4">
          {signals.map((signal, idx) => (
            <SignalCard key={signal.category} signal={signal} index={idx} />
          ))}
        </div>
      </div>

      {/* Evidence Trail Ledger */}
      <div className="mt-8">
        <EvidenceTable signals={signals} contractAddress={token.address} />
      </div>

      {/* AI Summary ("WHAT SHOULD I KNOW?") */}
      <div className="mt-8 rounded-2xl border border-[#A8FF4D]/20 bg-gradient-to-b from-[#0F140A] to-[#0A0A0A] p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#A8FF4D]/40 bg-[#A8FF4D]/20 text-[#A8FF4D]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8FF4D]">
              Analytical Interpretation
            </span>
            <h3 className="font-display text-lg sm:text-xl font-medium text-[#F5F5F2]">
              What Should I Know?
            </h3>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#D4D4D0] leading-relaxed font-light mt-3">
          {aiExplanation.whatShouldIKnow}
        </p>

        {/* Due Diligence Checklist */}
        {aiExplanation.recommendationsForDueDiligence && (
          <div className="mt-6 rounded-xl border border-[#1A1A1A] bg-[#050505]/70 p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8C8C] block mb-2">
              Recommended Investigative Next Steps
            </span>
            <ul className="space-y-2">
              {aiExplanation.recommendationsForDueDiligence.map((rec, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2.5 text-xs text-[#BBB]">
                  <span className="text-[#A8FF4D] font-mono shrink-0">[{rIdx + 1}]</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between text-[11px] font-mono text-[#666]">
          <span>Engine: {aiExplanation.modelUsed}</span>
          <span>Grounded strictly on observable Base bytecode and market data</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl border border-[#161616] bg-[#080808] p-4 text-center">
        <p className="text-xs text-[#8C8C8C] font-light leading-relaxed max-w-3xl mx-auto">
          <strong className="text-white/80 font-medium">Disclaimer:</strong> SCAMSIGNAL identifies observable signals and does not determine whether an asset or project is fraudulent. Information may be incomplete or change over time. Do your own research before interacting with any token or contract.
        </p>
      </div>
    </div>
  );
};
