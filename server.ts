import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { fetchContractData } from './server/baseScanner.js';
import { evaluateRiskSignals } from './server/riskEngine.js';
import { generateGeminiExplanation } from './server/geminiAdvisor.js';
import { DEMO_TOKENS } from './server/demoTokens.js';
import { InvestigationReport } from './src/types/investigation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API: Health / Ping
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SCAMSIGNAL Backend',
    chain: 'Base (8453)',
    timestamp: new Date().toISOString(),
  });
});

// API: Get Demo Tokens
app.get('/api/demo-tokens', (req: Request, res: Response) => {
  res.json({ tokens: DEMO_TOKENS });
});

// API: Investigate Contract Address
app.post('/api/investigate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Please provide a valid contract address.' });
      return;
    }

    const trimmed = address.trim();
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(trimmed)) {
      res.status(400).json({
        error: "That doesn't look like a valid Base contract address. Format must be 0x followed by 40 hexadecimal characters.",
      });
      return;
    }

    // 1. Gather observable on-chain evidence
    const { token, rawEvidence } = await fetchContractData(trimmed);

    // If address is not a contract (zero bytecode)
    if (!rawEvidence.isContract) {
      res.status(422).json({
        error: 'The address provided is an Externally Owned Account (EOA / wallet) or has no deployed bytecode on Base.',
        isEoa: true,
      });
      return;
    }

    // 2. Deterministic risk check engine
    const { signals, summary } = evaluateRiskSignals(token, rawEvidence);

    // 3. Gemini analytical synthesis
    const geminiResult = await generateGeminiExplanation(token, rawEvidence, signals, summary);

    // Apply refined explanations if Gemini provided clearer language
    if (geminiResult.refinedSignals && Array.isArray(geminiResult.refinedSignals)) {
      for (const ref of geminiResult.refinedSignals) {
        const matchingSignal = signals.find(s => s.category === ref.category);
        if (matchingSignal) {
          if (ref.whatWasFound && ref.whatWasFound.length > 10) {
            matchingSignal.whatWasFound = ref.whatWasFound;
          }
          if (ref.whyItMatters && ref.whyItMatters.length > 10) {
            matchingSignal.whyItMatters = ref.whyItMatters;
          }
        }
      }
    }

    const report: InvestigationReport = {
      id: `SIG-${Date.now().toString(36).toUpperCase()}-${trimmed.slice(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      token,
      rawEvidence,
      signals,
      summary,
      aiExplanation: {
        overview: geminiResult.overview,
        whatShouldIKnow: geminiResult.whatShouldIKnow,
        recommendationsForDueDiligence: geminiResult.recommendationsForDueDiligence,
        modelUsed: geminiResult.modelUsed,
      },
    };

    res.json({ report });
  } catch (err: any) {
    console.error('Investigation error:', err);
    res.status(500).json({
      error: 'Some evidence could not be retrieved. Please check the contract address and try again.',
      details: err?.message,
    });
  }
});

// Full-stack dev / prod server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SCAMSIGNAL investigation server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
