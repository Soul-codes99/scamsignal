export type SignalSeverity = 
  | 'HIGH ATTENTION'
  | 'ATTENTION'
  | 'INFORMATIONAL'
  | 'CLEAR / NO SIGNAL DETECTED'
  | 'UNKNOWN';

export type SignalConfidence = 'High' | 'Medium' | 'Low';

export type RiskCategory = 
  | 'contract_privileges'
  | 'holder_concentration'
  | 'liquidity'
  | 'transfer_behavior'
  | 'contract_verification';

export interface EvidenceItem {
  source: string;
  observedValue: string;
  interpretation: string;
  confidence: SignalConfidence;
  technicalDetails?: string;
}

export interface RiskSignal {
  category: RiskCategory;
  categoryLabel: string;
  severity: SignalSeverity;
  title: string;
  whatWasFound: string;
  whyItMatters: string;
  evidence: EvidenceItem[];
  source: string;
  confidence: SignalConfidence;
  technicalDetails?: {
    methodSelectors?: string[];
    bytecodePatterns?: string[];
    rawData?: Record<string, any>;
  };
}

export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  network: string;
  chainId: number;
  blockExplorerUrl: string;
  creationInfo?: {
    creatorAddress?: string;
    creationTx?: string;
    deployedAt?: string;
  };
}

export interface RawContractEvidence {
  isContract: boolean;
  bytecodeLength: number;
  ownerAddress?: string | null;
  hasOwnerFunction: boolean;
  hasRenounceOwnership: boolean;
  detectedSelectors: {
    name: string;
    selector: string;
    category: string;
    description: string;
  }[];
  liquidity: {
    available: boolean;
    usdAmount?: number;
    dexName?: string;
    pairAddress?: string;
    baseTokenSymbol?: string;
    quoteTokenSymbol?: string;
    priceUsd?: string;
    fdv?: number;
    lockStatusVerified: boolean;
    lockStatusNote: string;
  };
  verification: {
    isVerified: boolean;
    compilerVersion?: string;
    license?: string;
    sourceCodeAvailable: boolean;
  };
  distribution: {
    available: boolean;
    topHolderEstimatedPercentage?: number;
    lpSharePercentage?: number;
    burnedSupplyPercentage?: number;
    note: string;
  };
}

export interface InvestigationSummary {
  headline: string;
  keyFindingsCount: {
    highAttention: number;
    attention: number;
    informational: number;
    clear: number;
    unknown: number;
  };
  totalRiskSignals: number;
  neutralAssessment: string;
  uncertainties: string[];
}

export interface InvestigationReport {
  id: string;
  timestamp: string;
  token: TokenMetadata;
  rawEvidence: RawContractEvidence;
  signals: RiskSignal[];
  summary: InvestigationSummary;
  aiExplanation: {
    overview: string;
    recommendationsForDueDiligence: string[];
    whatShouldIKnow: string;
    modelUsed: string;
  };
}

export interface DemoToken {
  name: string;
  symbol: string;
  address: string;
  description: string;
  tag: string;
}
