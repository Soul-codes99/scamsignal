import React from 'react';
import { KeyRound, Users, Droplets, ArrowRightLeft, FileCheck } from 'lucide-react';

export const SignalsShowcase: React.FC = () => {
  const categories = [
    {
      num: '01',
      title: 'Contract Privileges',
      desc: 'Identifies active ownership, proxy upgradeability, and permissions to alter critical token parameters.',
      icon: KeyRound,
      metric: 'Bytecode & Storage',
    },
    {
      num: '02',
      title: 'Holder Concentration',
      desc: 'Measures circulating supply distribution among top wallets and separates DEX liquidity pools.',
      icon: Users,
      metric: 'Distribution Ledger',
    },
    {
      num: '03',
      title: 'Liquidity Depth & Locks',
      desc: 'Checks automated market maker reserve sizes, primary pool address, and verifiable lock states.',
      icon: Droplets,
      metric: 'AMM Reserves',
    },
    {
      num: '04',
      title: 'Transfer Behavior',
      desc: 'Detects explicit blacklist mechanics, adjustable fees or taxes, max transfer limits, and pause functions.',
      icon: ArrowRightLeft,
      metric: 'Function Selectors',
    },
    {
      num: '05',
      title: 'Contract Verification',
      desc: 'Verifies whether human-readable Solidity source code is published on the Base block explorer.',
      icon: FileCheck,
      metric: 'Explorer Compiler',
    },
  ];

  return (
    <section id="signals" className="py-20 border-t border-[#141414] relative bg-[#080808]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A8FF4D]">
            02 • Inspection Vectors
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#F5F5F2] mt-2">
            What SCAMSIGNAL looks for
          </h2>
          <p className="mt-3 text-sm text-[#8C8C8C] max-w-xl font-light">
            Five core categories evaluated deterministically before Gemini provides contextual analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.num}
                className="group relative rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 transition-all hover:border-[#2C2C2C] hover:bg-[#0E0E0E]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#8C8C8C] group-hover:text-[#A8FF4D] transition-colors">
                    {cat.num}
                  </span>
                  <span className="rounded bg-[#141414] px-2 py-0.5 font-mono text-[9px] text-[#666]">
                    {cat.metric}
                  </span>
                </div>

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#1A1A1A] bg-[#101010] text-[#A8FF4D]">
                  <Icon className="h-4 w-4" />
                </div>

                <h3 className="font-display text-lg font-medium text-[#F5F5F2]">
                  {cat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#8C8C8C] leading-relaxed font-light">
                  {cat.desc}
                </p>
              </div>
            );
          })}

          {/* Philosophy CTA card */}
          <div className="rounded-2xl border border-[#A8FF4D]/30 bg-[#A8FF4D]/5 p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8FF4D] block mb-2">
                Core Philosophy
              </span>
              <h3 className="font-display text-lg font-medium text-[#F5F5F2]">
                Evidence First. Explanation Second.
              </h3>
              <p className="mt-2 text-xs text-[#8C8C8C] leading-relaxed font-light">
                SCAMSIGNAL never guesses or claims an asset is definitely fraudulent. We report observable on-chain facts.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#A8FF4D]/20">
              <span className="font-mono text-xs text-[#A8FF4D]">
                ✓ Zero unsupported accusations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
