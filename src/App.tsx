/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { LoadingScanner } from './components/LoadingScanner.js';
import { ReportView } from './components/ReportView.js';
import { HowItWorks } from './components/HowItWorks.js';
import { SignalsShowcase } from './components/SignalsShowcase.js';
import { Philosophy } from './components/Philosophy.js';
import { Footer } from './components/Footer.js';
import { DemoToken, InvestigationReport } from './types/investigation.js';

export default function App() {
  const [inputAddress, setInputAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [demoTokens, setDemoTokens] = useState<DemoToken[]>([
    {
      name: 'Aerodrome Finance',
      symbol: 'AERO',
      address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
      description: 'Primary Base AMM & liquidity hub with verified contract and established pools.',
      tag: 'Verified Hub',
    },
    {
      name: 'Virtuals Protocol',
      symbol: 'VIRTUAL',
      address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
      description: 'AI agent protocol token on Base with active public liquidity.',
      tag: 'Active Protocol',
    },
    {
      name: 'Degen Token',
      symbol: 'DEGEN',
      address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
      description: 'Prominent community and tipping token deployed on Base L2.',
      tag: 'Community',
    },
    {
      name: 'USD Coin (Base Native)',
      symbol: 'USDC',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      description: 'Regulated fiat-backed stablecoin demonstrating institutional proxy & blacklist functions.',
      tag: 'Proxy',
    },
  ]);

  // Fetch live demo tokens if available
  useEffect(() => {
    fetch('/api/demo-tokens')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.tokens && data.tokens.length > 0) {
          setDemoTokens(data.tokens);
        }
      })
      .catch(() => {
        // Silently preserve preloaded default tokens
      });
  }, []);

  const handleInvestigate = async (addressToInvestigate: string) => {
    const trimmed = addressToInvestigate.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete contract investigation.');
      }

      setReport(data.report);
    } catch (err: any) {
      console.error('Investigation failed:', err);
      setErrorMessage(err.message || 'Unable to scan contract. Please check network connectivity and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (report) {
      setReport(null);
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F2] flex flex-col font-sans selection:bg-[#A8FF4D] selection:text-black">
      {/* Editorial Navigation */}
      <Navbar
        onReset={handleReset}
        onNavigateSection={handleNavigateSection}
        hasActiveReport={Boolean(report)}
        activeAddress={report?.token.address}
        activeSymbol={report?.token.symbol}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <LoadingScanner targetAddress={inputAddress} />
        ) : report ? (
          <ReportView report={report} onReset={handleReset} />
        ) : (
          <>
            <Hero
              onInvestigate={handleInvestigate}
              isLoading={isLoading}
              demoTokens={demoTokens}
              inputAddress={inputAddress}
              setInputAddress={setInputAddress}
              errorMessage={errorMessage}
            />
            <HowItWorks />
            <SignalsShowcase />
            <Philosophy />
          </>
        )}
      </main>

      {/* Minimal Editorial Footer */}
      <Footer />
    </div>
  );
}
