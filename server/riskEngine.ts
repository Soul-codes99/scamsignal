import { 
  RawContractEvidence, 
  RiskSignal, 
  TokenMetadata, 
  InvestigationSummary, 
  SignalSeverity 
} from '../src/types/investigation.js';

export function evaluateRiskSignals(
  token: TokenMetadata,
  evidence: RawContractEvidence
): { signals: RiskSignal[]; summary: InvestigationSummary } {
  const signals: RiskSignal[] = [];

  // ==========================================
  // Category A: CONTRACT OWNERSHIP / PRIVILEGES
  // ==========================================
  const ownershipSelectors = evidence.detectedSelectors.filter(s => s.category.includes('Ownership'));
  const hasOwner = Boolean(evidence.ownerAddress && evidence.ownerAddress !== '0x0000000000000000000000000000000000000000');
  
  if (hasOwner) {
    signals.push({
      category: 'contract_privileges',
      categoryLabel: '01 Contract Privileges',
      severity: 'ATTENTION',
      title: 'Active Contract Owner Detected',
      whatWasFound: `Contract exposes an active owner address (${evidence.ownerAddress}).`,
      whyItMatters: 'An active owner or administrative address may retain rights to invoke privileged functions or update configurations depending on the contract implementation.',
      source: 'Base RPC eth_call(owner)',
      confidence: 'High',
      evidence: [
        {
          source: 'Base RPC',
          observedValue: `Owner address: ${evidence.ownerAddress}`,
          interpretation: 'Ownership has not been renounced to a dead address or multi-sig proxy.',
          confidence: 'High',
        },
        {
          source: 'Bytecode Function Signatures',
          observedValue: `${ownershipSelectors.length} ownership-related functions observed in compiled bytecode.`,
          interpretation: 'Administrative interface functions are compiled into the deployed contract.',
          confidence: 'High',
        },
      ],
      technicalDetails: {
        methodSelectors: ownershipSelectors.map(s => `${s.selector} (${s.name})`),
        rawData: { ownerAddress: evidence.ownerAddress, hasRenounceOwnership: evidence.hasRenounceOwnership },
      },
    });
  } else if (evidence.hasRenounceOwnership && !evidence.ownerAddress) {
    signals.push({
      category: 'contract_privileges',
      categoryLabel: '01 Contract Privileges',
      severity: 'CLEAR / NO SIGNAL DETECTED',
      title: 'No Active Owner Returned',
      whatWasFound: 'The contract owner function either returns address(0) or is not callable by standard interface.',
      whyItMatters: 'Absence of a single active owner reduces the risk of arbitrary administrative modification, though upgradeability or multi-roles could still exist.',
      source: 'Base RPC eth_call',
      confidence: 'Medium',
      evidence: [
        {
          source: 'Base RPC',
          observedValue: 'owner() call returned zero address or empty',
          interpretation: 'Contract does not point to an active external owner account.',
          confidence: 'Medium',
        },
      ],
      technicalDetails: {
        rawData: { ownerAddress: null, hasRenounce: evidence.hasRenounceOwnership },
      },
    });
  } else {
    signals.push({
      category: 'contract_privileges',
      categoryLabel: '01 Contract Privileges',
      severity: 'INFORMATIONAL',
      title: 'Standard Owner Function Not Detected',
      whatWasFound: 'No standard ERC-173 / Ownable owner() getter responded on the deployed contract.',
      whyItMatters: 'The contract may use custom access controls, role-based access (AccessControl), or lack centralized ownership entirely.',
      source: 'Base RPC Bytecode',
      confidence: 'Medium',
      evidence: [
        {
          source: 'Base RPC',
          observedValue: 'owner() selector 0x8da5cb5b not active',
          interpretation: 'Contract does not use the standard OpenZeppelin Ownable pattern.',
          confidence: 'Medium',
        },
      ],
    });
  }

  // ==========================================
  // Category B: HOLDER CONCENTRATION
  // ==========================================
  if (evidence.distribution.available && evidence.distribution.topHolderEstimatedPercentage) {
    const pct = evidence.distribution.topHolderEstimatedPercentage;
    const severity: SignalSeverity = pct > 65 ? 'ATTENTION' : 'INFORMATIONAL';
    signals.push({
      category: 'holder_concentration',
      categoryLabel: '02 Holder Concentration',
      severity,
      title: pct > 65 ? 'High Pool / Holder Concentration' : 'Observed Concentration',
      whatWasFound: `Approximately ${pct}% of token supply/depth is concentrated in the primary pool or top observable holders.`,
      whyItMatters: 'High concentration means a relatively small number of wallets or liquidity reserves control a large portion of the token supply. Large holders can potentially have a significant effect on liquidity or market activity.',
      source: 'DexScreener & On-chain Pool Data',
      confidence: 'Medium',
      evidence: [
        {
          source: 'DexScreener Pool Depth',
          observedValue: `Estimated ${pct}% concentration`,
          interpretation: 'A substantial portion of accessible tokens is concentrated.',
          confidence: 'Medium',
        },
      ],
      technicalDetails: {
        rawData: evidence.distribution,
      },
    });
  } else {
    signals.push({
      category: 'holder_concentration',
      categoryLabel: '02 Holder Concentration',
      severity: 'UNKNOWN',
      title: 'Holder Concentration Data Unavailable',
      whatWasFound: 'Full ledger wallet distribution data could not be independently retrieved from real-time on-chain indexer without rate limits.',
      whyItMatters: 'Without complete holder records, wallet distribution cannot be verified. This does not indicate high or low risk; further investigation on Basescan is recommended.',
      source: 'Public Base Node / Indexer',
      confidence: 'Low',
      evidence: [
        {
          source: 'Base Ledger Explorer',
          observedValue: 'Indexer query incomplete',
          interpretation: 'Distribution requires full token holder table scan.',
          confidence: 'Low',
        },
      ],
    });
  }

  // ==========================================
  // Category C: LIQUIDITY
  // ==========================================
  if (evidence.liquidity.available && evidence.liquidity.usdAmount !== undefined) {
    const liqUsd = evidence.liquidity.usdAmount;
    let liqSeverity: SignalSeverity = 'CLEAR / NO SIGNAL DETECTED';
    let liqTitle = 'Observable Liquidity Pool Identified';
    let liqFound = `Estimated liquidity of ~$${Math.round(liqUsd).toLocaleString('en-US')} identified on ${evidence.liquidity.dexName} (${evidence.liquidity.pairAddress?.slice(0, 10)}...).`;

    if (liqUsd < 5000) {
      liqSeverity = 'HIGH ATTENTION';
      liqTitle = 'Very Low Observable Liquidity';
      liqFound = `Very low liquidity pool identified (~$${Math.round(liqUsd).toLocaleString('en-US')}) on ${evidence.liquidity.dexName}.`;
    } else if (liqUsd < 25000) {
      liqSeverity = 'ATTENTION';
      liqTitle = 'Modest Liquidity Depth';
    }

    signals.push({
      category: 'liquidity',
      categoryLabel: '03 Liquidity',
      severity: liqSeverity,
      title: liqTitle,
      whatWasFound: liqFound,
      whyItMatters: 'Low liquidity depth can lead to high slippage and difficulty exiting positions. Independent liquidity lock status could not be verified from on-chain locker registries.',
      source: 'DexScreener & Automated Market Makers',
      confidence: 'High',
      evidence: [
        {
          source: 'DexScreener',
          observedValue: `USD Liquidity: $${Math.round(liqUsd).toLocaleString('en-US')} on ${evidence.liquidity.dexName}`,
          interpretation: 'Public AMM pool exists on Base.',
          confidence: 'High',
        },
        {
          source: 'Locker Verification',
          observedValue: 'Lock status could not be independently verified',
          interpretation: evidence.liquidity.lockStatusNote,
          confidence: 'Medium',
        },
      ],
      technicalDetails: {
        rawData: evidence.liquidity,
      },
    });
  } else {
    signals.push({
      category: 'liquidity',
      categoryLabel: '03 Liquidity',
      severity: 'HIGH ATTENTION',
      title: 'No Public Liquidity Pool Found',
      whatWasFound: 'No indexed automated market maker (AMM) liquidity pairs were discovered for this token contract on Base.',
      whyItMatters: 'Tokens without active liquidity pools cannot be freely traded or swapped on decentralized exchanges.',
      source: 'DexScreener Indexer',
      confidence: 'High',
      evidence: [
        {
          source: 'DexScreener Base Pools',
          observedValue: 'Zero active trading pairs returned',
          interpretation: 'Token is either pre-launch, privately distributed, or illiquid.',
          confidence: 'High',
        },
      ],
    });
  }

  // ==========================================
  // Category D: TRANSFER / TOKEN BEHAVIOR
  // ==========================================
  const transferSelectors = evidence.detectedSelectors.filter(
    s => s.category === 'Transfer Behavior' || s.category === 'Fee Modification' || s.category === 'Transfer Limits' || s.category === 'Minting'
  );

  const hasBlacklist = transferSelectors.some(s => s.name.toLowerCase().includes('blacklist'));
  const hasFee = transferSelectors.some(s => s.category === 'Fee Modification');
  const hasMint = transferSelectors.some(s => s.category === 'Minting');
  const hasLimits = transferSelectors.some(s => s.category === 'Transfer Limits');
  const hasPause = transferSelectors.some(s => s.name.toLowerCase().includes('pause'));

  const detectedBehaviors: string[] = [];
  if (hasBlacklist) detectedBehaviors.push('address blacklisting capability');
  if (hasFee) detectedBehaviors.push('adjustable transaction fee functions');
  if (hasMint) detectedBehaviors.push('external minting function');
  if (hasLimits) detectedBehaviors.push('max transaction / wallet limits');
  if (hasPause) detectedBehaviors.push('transfer pausing capability');

  if (detectedBehaviors.length > 0) {
    const isCritical = hasBlacklist || (hasFee && hasMint);
    signals.push({
      category: 'transfer_behavior',
      categoryLabel: '04 Transfer Behavior',
      severity: isCritical ? 'HIGH ATTENTION' : 'ATTENTION',
      title: 'Non-Standard Transfer Controls Detected',
      whatWasFound: `Bytecode contains function signatures matching: ${detectedBehaviors.join(', ')}.`,
      whyItMatters: 'Transfer restrictions or adjustable fee parameters allow authorized callers to alter trade execution, restrict wallet transfers, or impose conditions on token movement.',
      source: 'Base Contract Bytecode Inspection',
      confidence: 'High',
      evidence: transferSelectors.map(sel => ({
        source: 'Bytecode Selector',
        observedValue: `${sel.selector} -> ${sel.name}`,
        interpretation: sel.description,
        confidence: 'High' as const,
      })),
      technicalDetails: {
        methodSelectors: transferSelectors.map(s => `${s.selector}: ${s.name} (${s.description})`),
      },
    });
  } else {
    signals.push({
      category: 'transfer_behavior',
      categoryLabel: '04 Transfer Behavior',
      severity: 'CLEAR / NO SIGNAL DETECTED',
      title: 'No Exotic Transfer Restraints Detected',
      whatWasFound: 'No explicit blacklist, variable fee modifiers, or trading halt selectors were identified in the scanned bytecode.',
      whyItMatters: 'Standard transfer mechanics decrease the likelihood of unexpected tax spikes or transaction freezes.',
      source: 'Base Contract Bytecode Inspection',
      confidence: 'Medium',
      evidence: [
        {
          source: 'Bytecode Signature Scan',
          observedValue: 'Zero matching blacklist/tax/pause function selectors',
          interpretation: 'Contract exhibits standard ERC-20 transfer signatures.',
          confidence: 'Medium',
        },
      ],
    });
  }

  // ==========================================
  // Category E: CONTRACT VERIFICATION
  // ==========================================
  if (evidence.verification.isVerified) {
    signals.push({
      category: 'contract_verification',
      categoryLabel: '05 Contract Verification',
      severity: 'CLEAR / NO SIGNAL DETECTED',
      title: 'Contract Source Code Verified',
      whatWasFound: `Contract source code is publicly verified on Base block explorer${evidence.verification.compilerVersion ? ` (Solidity ${evidence.verification.compilerVersion})` : ''}.`,
      whyItMatters: 'Verified source code allows independent security researchers and community auditors to review the exact logic governing the contract.',
      source: 'Blockscout Base Explorer',
      confidence: 'High',
      evidence: [
        {
          source: 'Blockscout Base',
          observedValue: 'Contract source code verified: true',
          interpretation: 'Full human-readable source code matches compiled bytecode.',
          confidence: 'High',
        },
      ],
      technicalDetails: {
        rawData: evidence.verification,
      },
    });
  } else {
    signals.push({
      category: 'contract_verification',
      categoryLabel: '05 Contract Verification',
      severity: 'HIGH ATTENTION',
      title: 'Contract Source Not Verified',
      whatWasFound: 'The contract source code is not published or verified on the Base block explorer.',
      whyItMatters: 'When a contract is unverified, users cannot inspect the human-readable Solidity source code to confirm how funds are handled or what privileges exist.',
      source: 'Blockscout Base Explorer',
      confidence: 'High',
      evidence: [
        {
          source: 'Blockscout Base',
          observedValue: 'Unverified Bytecode Only',
          interpretation: 'Source code is opaque and cannot be directly audited.',
          confidence: 'High',
        },
      ],
    });
  }

  // Generate Summary Metrics
  const keyFindingsCount = {
    highAttention: signals.filter(s => s.severity === 'HIGH ATTENTION').length,
    attention: signals.filter(s => s.severity === 'ATTENTION').length,
    informational: signals.filter(s => s.severity === 'INFORMATIONAL').length,
    clear: signals.filter(s => s.severity === 'CLEAR / NO SIGNAL DETECTED').length,
    unknown: signals.filter(s => s.severity === 'UNKNOWN').length,
  };

  const totalRiskSignals = keyFindingsCount.highAttention + keyFindingsCount.attention;

  let headline = 'Risk signals detected';
  let neutralAssessment = `${totalRiskSignals} observable risk signal${totalRiskSignals === 1 ? '' : 's'} were detected. These signals do not prove that the project is fraudulent, but they warrant additional investigation prior to interacting.`;

  if (totalRiskSignals === 0) {
    headline = 'No critical risk signals observed';
    neutralAssessment = 'No high-attention risk signals were detected in the inspected categories. However, on-chain dynamics and market risks can evolve.';
  }

  const uncertainties: string[] = [];
  if (!evidence.liquidity.lockStatusVerified) {
    uncertainties.push('Liquidity lock status could not be independently verified from third-party locker registries.');
  }
  if (!evidence.distribution.available || !evidence.distribution.topHolderEstimatedPercentage) {
    uncertainties.push('Full historical holder distribution ledger requires deep indexer verification.');
  }

  return {
    signals,
    summary: {
      headline,
      keyFindingsCount,
      totalRiskSignals,
      neutralAssessment,
      uncertainties,
    },
  };
}
