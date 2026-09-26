import { RawContractEvidence, TokenMetadata } from '../src/types/investigation.js';

const BASE_RPC_URL = 'https://mainnet.base.org';

// Helper for standard hex decode of strings / uint256
function decodeString(hex: string): string {
  if (!hex || hex === '0x') return '';
  const cleanHex = hex.replace(/^0x/, '');
  try {
    if (cleanHex.length >= 128) {
      const lengthHex = cleanHex.slice(64, 128);
      const length = parseInt(lengthHex, 16);
      if (length > 0 && length < 1000) {
        const strHex = cleanHex.slice(128, 128 + length * 2);
        const bytes = [];
        for (let i = 0; i < strHex.length; i += 2) {
          bytes.push(parseInt(strHex.substr(i, 2), 16));
        }
        return Buffer.from(bytes).toString('utf8').replace(/\0/g, '').trim();
      }
    }
    // Fallback: direct ASCII bytes (bytes32 string)
    const bytes = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      const code = parseInt(cleanHex.substr(i, 2), 16);
      if (code !== 0) bytes.push(code);
    }
    return Buffer.from(bytes).toString('utf8').replace(/[\x00-\x1F\x7F]/g, '').trim();
  } catch {
    return '';
  }
}

function decodeUint256(hex: string): bigint {
  if (!hex || hex === '0x') return 0n;
  try {
    return BigInt(hex);
  } catch {
    return 0n;
  }
}

function decodeAddress(hex: string): string | null {
  if (!hex || hex === '0x' || hex.length < 66) return null;
  const cleanHex = hex.replace(/^0x/, '');
  const addrHex = '0x' + cleanHex.slice(24, 64);
  if (addrHex === '0x0000000000000000000000000000000000000000') return null;
  return addrHex.toLowerCase();
}

async function rpcCall(method: string, params: any[]): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`RPC status ${res.status}`);
    const data = await res.json();
    return data.result;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// Known 4-byte function signatures to scan in contract bytecode
const KNOWN_SELECTORS: { selector: string; name: string; category: string; description: string }[] = [
  // Ownership & Admin
  { selector: '8da5cb5b', name: 'owner()', category: 'Ownership', description: 'Returns contract owner address' },
  { selector: 'f2fde38b', name: 'transferOwnership(address)', category: 'Ownership', description: 'Allows current owner to transfer ownership to another address' },
  { selector: '715018a6', name: 'renounceOwnership()', category: 'Ownership', description: 'Allows owner to permanently relinquish administrative control' },
  { selector: '3659cfe6', name: 'upgradeTo(address)', category: 'Ownership / Proxy', description: 'Contract implementation can be changed via proxy upgrade' },
  { selector: '4f1be947', name: 'upgradeToAndCall(address,bytes)', category: 'Ownership / Proxy', description: 'Contract implementation upgrade with initialization call' },
  
  // Minting
  { selector: '40c10f19', name: 'mint(address,uint256)', category: 'Minting', description: 'Function to create new tokens increasing total supply' },
  { selector: 'a0712d68', name: 'mint(uint256)', category: 'Minting', description: 'Direct minting function' },
  
  // Pausing & Trading Control
  { selector: '02455208', name: 'pause()', category: 'Transfer Behavior', description: 'Allows privileged role to stop token transfers' },
  { selector: '3f4ba83a', name: 'unpause()', category: 'Transfer Behavior', description: 'Re-enables token transfers after pausing' },
  { selector: '5c975abb', name: 'paused()', category: 'Transfer Behavior', description: 'Exposes pause state indicator' },
  { selector: 'c9567bf9', name: 'openTrading()', category: 'Transfer Behavior', description: 'Trading enablement gate' },
  { selector: '8a92d098', name: 'setTrading(bool)', category: 'Transfer Behavior', description: 'Controls whether general trading is enabled' },

  // Blacklist & Whitelist
  { selector: 'f9f02b01', name: 'blacklist(address)', category: 'Transfer Behavior', description: 'Can block specified addresses from sending or receiving' },
  { selector: 'b924a737', name: 'addBlacklist(address)', category: 'Transfer Behavior', description: 'Adds target wallet to restricted blacklist' },
  { selector: '44337660', name: 'setBlacklist(address,bool)', category: 'Transfer Behavior', description: 'Modifies wallet blacklist status' },
  { selector: 'fe575a62', name: 'isBlacklisted(address)', category: 'Transfer Behavior', description: 'Checks if wallet is currently blacklisted' },
  { selector: '6a24683a', name: 'blacklistAddress(address)', category: 'Transfer Behavior', description: 'Address restriction function' },

  // Fees & Limits
  { selector: '144fa6d7', name: 'setTaxFee(uint256)', category: 'Fee Modification', description: 'Can alter transaction tax or fee rates' },
  { selector: 'a9059cbb', name: 'setFee(uint256)', category: 'Fee Modification', description: 'Alters contract fee percentage' },
  { selector: 'b6347f71', name: 'setBuyFee(uint256)', category: 'Fee Modification', description: 'Sets dedicated fee on purchase transactions' },
  { selector: '9c00b0f4', name: 'setSellFee(uint256)', category: 'Fee Modification', description: 'Sets dedicated fee on sell transactions' },
  { selector: 'f088d594', name: 'setMaxTxPercent(uint256)', category: 'Transfer Limits', description: 'Restricts maximum volume per transaction' },
  { selector: 'ecb44081', name: 'setMaxWallet(uint256)', category: 'Transfer Limits', description: 'Limits maximum tokens a single wallet can hold' },
  { selector: '7a6378e9', name: 'setMaxTxAmount(uint256)', category: 'Transfer Limits', description: 'Enforces transaction size ceiling' },
];

export async function fetchContractData(address: string): Promise<{
  token: TokenMetadata;
  rawEvidence: RawContractEvidence;
}> {
  const normAddress = address.toLowerCase();

  // 1. Check if contract code exists on Base
  let bytecode = '0x';
  try {
    bytecode = await rpcCall('eth_getCode', [normAddress, 'latest']);
  } catch (err) {
    console.warn(`RPC eth_getCode failed for ${normAddress}:`, err);
  }

  const isContract = Boolean(bytecode && bytecode !== '0x' && bytecode.length > 2);
  const bytecodeLength = isContract ? (bytecode.length - 2) / 2 : 0;

  // 2. Query ERC-20 standard methods: name, symbol, decimals, totalSupply, owner
  let name = 'Unknown Token';
  let symbol = 'UNKNOWN';
  let decimals = 18;
  let totalSupply = '0';
  let ownerAddress: string | null = null;

  if (isContract) {
    const calls = [
      rpcCall('eth_call', [{ to: normAddress, data: '0x06fdde03' }, 'latest']).catch(() => null), // name()
      rpcCall('eth_call', [{ to: normAddress, data: '0x95d89b41' }, 'latest']).catch(() => null), // symbol()
      rpcCall('eth_call', [{ to: normAddress, data: '0x313ce567' }, 'latest']).catch(() => null), // decimals()
      rpcCall('eth_call', [{ to: normAddress, data: '0x18160ddd' }, 'latest']).catch(() => null), // totalSupply()
      rpcCall('eth_call', [{ to: normAddress, data: '0x8da5cb5b' }, 'latest']).catch(() => null), // owner()
    ];

    const [nameRes, symbolRes, decimalsRes, supplyRes, ownerRes] = await Promise.all(calls);

    if (nameRes && nameRes !== '0x') {
      const decodedName = decodeString(nameRes);
      if (decodedName) name = decodedName;
    }
    if (symbolRes && symbolRes !== '0x') {
      const decodedSymbol = decodeString(symbolRes);
      if (decodedSymbol) symbol = decodedSymbol;
    }
    if (decimalsRes && decimalsRes !== '0x') {
      decimals = Number(decodeUint256(decimalsRes));
      if (isNaN(decimals) || decimals < 0 || decimals > 36) decimals = 18;
    }
    if (supplyRes && supplyRes !== '0x') {
      const rawSupply = decodeUint256(supplyRes);
      // Format with decimals
      const divisor = 10n ** BigInt(decimals);
      const wholePart = rawSupply / divisor;
      totalSupply = wholePart.toLocaleString('en-US');
    }
    if (ownerRes && ownerRes !== '0x') {
      ownerAddress = decodeAddress(ownerRes);
    }
  }

  // 3. Scan bytecode for known selectors
  const detectedSelectors: RawContractEvidence['detectedSelectors'] = [];
  const cleanBytecode = bytecode.replace(/^0x/, '').toLowerCase();

  for (const item of KNOWN_SELECTORS) {
    if (cleanBytecode.includes(item.selector.toLowerCase())) {
      detectedSelectors.push({
        name: item.name,
        selector: '0x' + item.selector,
        category: item.category,
        description: item.description,
      });
    }
  }

  const hasOwnerFunction = detectedSelectors.some(s => s.name.startsWith('owner') || s.name.startsWith('transferOwnership'));
  const hasRenounceOwnership = detectedSelectors.some(s => s.name.startsWith('renounceOwnership'));

  // 4. DexScreener Base Token Pairs (Liquidity & Price)
  let liquidity: RawContractEvidence['liquidity'] = {
    available: false,
    lockStatusVerified: false,
    lockStatusNote: 'Liquidity lock status could not be independently verified.',
  };

  try {
    const dexController = new AbortController();
    const dexTimeout = setTimeout(() => dexController.abort(), 4000);
    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${normAddress}`, {
      signal: dexController.signal,
    });
    clearTimeout(dexTimeout);

    if (dexRes.ok) {
      const dexData = await dexRes.json();
      if (dexData.pairs && dexData.pairs.length > 0) {
        // Find best pair on Base
        const basePairs = dexData.pairs.filter((p: any) => p.chainId === 'base');
        const primaryPair = basePairs.length > 0 ? basePairs[0] : dexData.pairs[0];

        if (primaryPair) {
          liquidity = {
            available: true,
            usdAmount: primaryPair.liquidity?.usd || 0,
            dexName: primaryPair.dexId ? primaryPair.dexId.toUpperCase() : 'Decentralized Exchange',
            pairAddress: primaryPair.pairAddress,
            baseTokenSymbol: primaryPair.baseToken?.symbol || symbol,
            quoteTokenSymbol: primaryPair.quoteToken?.symbol || 'WETH',
            priceUsd: primaryPair.priceUsd ? `$${primaryPair.priceUsd}` : undefined,
            fdv: primaryPair.fdv,
            lockStatusVerified: false,
            lockStatusNote: 'Liquidity lock status could not be independently verified.',
          };

          if (name === 'Unknown Token' && primaryPair.baseToken?.name) {
            name = primaryPair.baseToken.name;
          }
          if (symbol === 'UNKNOWN' && primaryPair.baseToken?.symbol) {
            symbol = primaryPair.baseToken.symbol;
          }
        }
      }
    }
  } catch (err) {
    console.warn(`DexScreener fetch failed for ${normAddress}:`, err);
  }

  // 5. Blockscout Base Verification Check
  let verification: RawContractEvidence['verification'] = {
    isVerified: false,
    sourceCodeAvailable: false,
  };

  let creationInfo: TokenMetadata['creationInfo'] = undefined;

  try {
    const scoutController = new AbortController();
    const scoutTimeout = setTimeout(() => scoutController.abort(), 4000);
    const scoutRes = await fetch(`https://base.blockscout.com/api/v2/smart-contracts/${normAddress}`, {
      signal: scoutController.signal,
    });
    clearTimeout(scoutTimeout);

    if (scoutRes.ok) {
      const scoutData = await scoutRes.json();
      verification = {
        isVerified: Boolean(scoutData.is_verified),
        compilerVersion: scoutData.compiler_version,
        license: scoutData.license_type,
        sourceCodeAvailable: Boolean(scoutData.is_verified),
      };
      if (name === 'Unknown Token' && scoutData.name) {
        name = scoutData.name;
      }
    }
  } catch (err) {
    console.warn(`Blockscout verification check failed for ${normAddress}:`, err);
  }

  // 6. Distribution analysis heuristics based on available pair liquidity & total supply
  let distribution: RawContractEvidence['distribution'] = {
    available: false,
    note: 'Holder distribution data could not be independently retrieved from full on-chain trace.',
  };

  if (liquidity.available && liquidity.usdAmount !== undefined) {
    // If we have verified liquidity pool and FDV
    if (liquidity.fdv && liquidity.fdv > 0) {
      const poolShare = Math.min(100, Math.round(((liquidity.usdAmount / 2) / liquidity.fdv) * 100));
      distribution = {
        available: true,
        lpSharePercentage: poolShare,
        topHolderEstimatedPercentage: poolShare > 70 ? poolShare : undefined,
        note: `Primary liquidity pool accounts for approximately ${poolShare}% of the estimated circulating capital.`,
      };
    } else {
      distribution = {
        available: true,
        note: `Active liquidity pool identified on ${liquidity.dexName}. Individual wallet distribution requires block explorer lookup.`,
      };
    }
  }

  const token: TokenMetadata = {
    address: normAddress,
    name,
    symbol,
    decimals,
    totalSupply: totalSupply !== '0' ? totalSupply : 'Unavailable',
    network: 'Base',
    chainId: 8453,
    blockExplorerUrl: `https://basescan.org/token/${normAddress}`,
    creationInfo,
  };

  const rawEvidence: RawContractEvidence = {
    isContract,
    bytecodeLength,
    ownerAddress,
    hasOwnerFunction,
    hasRenounceOwnership,
    detectedSelectors,
    liquidity,
    verification,
    distribution,
  };

  return { token, rawEvidence };
}
