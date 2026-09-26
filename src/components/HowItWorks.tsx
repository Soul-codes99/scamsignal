import React from 'react';
import { Database, Binary, BrainCircuit } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'COLLECT',
      desc: 'Gather observable blockchain and contract data directly from Base RPC and live decentralized exchange pools.',
      icon: Database,
      tag: 'Raw RPC Data',
    },
    {
      step: '02',
      title: 'CHECK',
      desc: 'Run deterministic checks against compiled bytecode, ownership functions, liquidity depth, and transfer constraints.',
      icon: Binary,
      tag: 'Deterministic Engine',
    },
    {
      step: '03',
      title: 'EXPLAIN',
      desc: 'Gemini turns the collected evidence into clear, objective, plain-English explanations without hallucinated claims.',
      icon: BrainCircuit,
      tag: 'Gemini Reasoning',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-[#141414] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#A8FF4D]">
              01 • Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#F5F5F2] mt-2">
              How SCAMSIGNAL operates
            </h2>
          </div>
          <p className="text-sm text-[#8C8C8C] max-w-md font-light">
            A three-tier pipeline that strictly separates raw on-chain facts from analytical synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 sm:p-8 transition-all hover:border-[#A8FF4D]/40 hover:bg-[#0E0E0E]"
              >
                <div className="flex items-center justify-between border-b border-[#141414] pb-4 mb-6">
                  <span className="font-mono text-2xl font-light text-[#A8FF4D]">
                    {item.step}
                  </span>
                  <span className="rounded-full border border-[#1A1A1A] bg-[#121212] px-2.5 py-0.5 font-mono text-[10px] text-[#8C8C8C]">
                    {item.tag}
                  </span>
                </div>

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#1A1A1A] bg-[#121212] text-[#F5F5F2] group-hover:border-[#A8FF4D]/40 group-hover:text-[#A8FF4D] transition-colors">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-display text-xl font-medium text-[#F5F5F2] tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#8C8C8C] leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
