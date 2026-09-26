import { GoogleGenAI, Type } from '@google/genai';
import { 
  TokenMetadata, 
  RawContractEvidence, 
  RiskSignal, 
  InvestigationSummary 
} from '../src/types/investigation.js';

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateGeminiExplanation(
  token: TokenMetadata,
  rawEvidence: RawContractEvidence,
  signals: RiskSignal[],
  summary: InvestigationSummary
): Promise<{
  overview: string;
  whatShouldIKnow: string;
  recommendationsForDueDiligence: string[];
  refinedSignals?: {
    category: string;
    whatWasFound: string;
    whyItMatters: string;
  }[];
  modelUsed: string;
}> {
  const ai = getAiClient();

  // Deterministic fallback synthesis
  const fallback = {
    overview: `SCAMSIGNAL evaluated ${token.name} (${token.symbol}) across 5 core on-chain categories on Base. ${summary.totalRiskSignals} observable risk signal(s) were flagged for review.`,
    whatShouldIKnow: `This token exhibits ${summary.totalRiskSignals > 0 ? `${summary.totalRiskSignals} observable signal(s) requiring attention` : 'no critical risk signals in scanned categories'}. These findings reflect public on-chain parameters and do not assert fraudulent intent. Always verify liquidity locks and team credentials independently before interacting.`,
    recommendationsForDueDiligence: [
      'Verify if team identities or audits exist on the project official repository.',
      'Check whether liquidity has a verifiable time-lock in a reputable escrow contract.',
      'Test small transaction amounts if you ever decide to interact on-chain.',
    ],
    modelUsed: 'Deterministic Heuristic Engine (Gemini API Standby)',
  };

  if (!ai) {
    return fallback;
  }

  // Create promise with 5s timeout
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout')), 5000)
  );

  try {
    const prompt = `You are the analytical engine for SCAMSIGNAL, an AI-assisted crypto risk investigation tool on the Base network.

PRODUCT PHILOSOPHY & MANDATORY RULES:
1. EVIDENCE FIRST. EXPLANATION SECOND. NO UNSUPPORTED ACCUSATIONS.
2. NEVER claim that a token is definitely a scam, fraudulent, or safe.
3. NEVER invent blockchain addresses, numbers, or facts.
4. If a piece of data is unavailable, explicitly say "Data unavailable" or "Could not be independently verified".
5. Distinguish clearly between observable facts, potential risk implications, and uncertainty.
6. Provide plain-English explanations that an everyday user can understand without jargon overload.
7. Keep tone calm, objective, technical, and neutral. NO fear-mongering and NO financial advice (never say buy/sell/dump).

HERE IS THE OBSERVABLE EVIDENCE FOR THIS BASE TOKEN:
Token: ${token.name} (${token.symbol})
Address: ${token.address}
Network: Base (Chain ID 8453)
Bytecode Length: ${rawEvidence.bytecodeLength} bytes
Owner Address: ${rawEvidence.ownerAddress || 'None detected'}
Detected Selectors: ${JSON.stringify(rawEvidence.detectedSelectors.map(s => s.name))}
Liquidity: ${JSON.stringify(rawEvidence.liquidity)}
Verification: ${JSON.stringify(rawEvidence.verification)}
Distribution: ${JSON.stringify(rawEvidence.distribution)}
Calculated Signals: ${JSON.stringify(signals.map(s => ({
  category: s.category,
  severity: s.severity,
  title: s.title,
  whatWasFound: s.whatWasFound,
  whyItMatters: s.whyItMatters,
})))}

Produce a structured JSON output with:
- overview: A 1-2 sentence objective statement of what was inspected and total signals.
- whatShouldIKnow: A clear 2-3 sentence neutral answer to "What should I know before interacting with this token?"
- recommendationsForDueDiligence: An array of 3 practical, concrete investigative steps for the user.
- refinedSignals: Array corresponding to the 5 categories (contract_privileges, holder_concentration, liquidity, transfer_behavior, contract_verification) with concise, crystal-clear plain-English whatWasFound and whyItMatters.`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            whatShouldIKnow: { type: Type.STRING },
            recommendationsForDueDiligence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            refinedSignals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  whatWasFound: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                },
                required: ['category', 'whatWasFound', 'whyItMatters'],
              },
            },
          },
          required: ['overview', 'whatShouldIKnow', 'recommendationsForDueDiligence'],
        },
      },
    });

    const response = await Promise.race([apiCall, timeoutPromise]);
    const text = response.text?.trim();
    if (!text) return fallback;

    const parsed = JSON.parse(text);
    return {
      overview: parsed.overview || fallback.overview,
      whatShouldIKnow: parsed.whatShouldIKnow || fallback.whatShouldIKnow,
      recommendationsForDueDiligence: parsed.recommendationsForDueDiligence || fallback.recommendationsForDueDiligence,
      refinedSignals: parsed.refinedSignals,
      modelUsed: 'Gemini 3.8 Flash (Server-side)',
    };
  } catch (err) {
    console.warn('Gemini explanation fallback activated:', err);
    return fallback;
  }
}
