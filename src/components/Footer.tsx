import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#161616] bg-[#050505] py-12 text-[#8C8C8C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#141414]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-[#A8FF4D]">✳</span>
              <span className="font-display text-base font-semibold text-[#F5F5F2]">
                SCAMSIGNAL
              </span>
            </div>
            <p className="mt-1 text-xs text-[#666] font-light">
              Evidence before interaction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F5F5F2] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F5F5F2] transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href="https://docs.base.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F5F5F2] transition-colors inline-flex items-center gap-1"
            >
              Base Docs
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F5F5F2] transition-colors inline-flex items-center gap-1"
            >
              BaseScan
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[#555]">
          <p>
            SCAMSIGNAL is an AI-assisted crypto risk investigation tool for Base L2. Not financial advice.
          </p>
          <p className="font-mono text-[11px]">
            Base Chain ID: 8453 • Model: Gemini 3.8 Flash
          </p>
        </div>
      </div>
    </footer>
  );
};
