import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// Icons (Optimized SVG Components)
// ============================================

const ArrowLeft = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const TrendingUp = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const TrendingDown = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
);

const RefreshCw = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 21H3v-5"/></svg>
);

const Activity = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

// ============================================
// Enhanced Styles
// ============================================

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --bg-dark: #000000;
  --bg-card: #1a1a1a;
  --text-white: #ffffff;
  --text-grey: #94a3b8;
  --primary-blue: #3b82f6;
  --primary-purple: #8b5cf6;
  --success: #10b981;
  --danger: #ef4444;
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-highlight: rgba(255, 255, 255, 0.2);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
 background: #121212;
  color: var(--text-white);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.dashboard-wrapper {
  padding: 2rem 5%;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

.grey-wrapper {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1.25rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.grey-wrapper:hover {
  border-color: var(--glass-highlight);
  transform: translateY(-2px);
  box-shadow: 0 25px 70px -10px rgba(0,0,0,0.5);
}

.coin-header-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
}

.coin-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.compare-selectors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.custom-select {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  color: var(--text-white);
  border-radius: 0.75rem;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.custom-select:hover, .custom-select:focus {
  border-color: var(--primary-blue);
  background: rgba(0, 0, 0, 0.5);
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.toggle-group {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.75rem;
  padding: 0.4rem;
  border: 1px solid var(--glass-border);
  gap: 0.25rem;
}

.toggle-btn {
  padding: 0.65rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-grey);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 0.9rem;
}

.toggle-btn:hover { 
  color: white; 
  background: rgba(255,255,255,0.08); 
}

.toggle-btn.active { 
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple)); 
  color: white; 
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.stat-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: var(--glass-highlight);
  transform: translateY(-2px);
}

.comparison-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
}

.badge-winner {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--success);
}

.badge-loser {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--danger);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@media screen and (max-width: 1024px) {
  .dashboard-wrapper { padding: 1.5rem 3%; }
  .compare-selectors { gap: 1.5rem; }
}

@media screen and (max-width: 768px) {
  .dashboard-wrapper { padding: 1rem; }
  .compare-selectors { grid-template-columns: 1fr; gap: 1rem; }
  .chart-controls { flex-direction: column; align-items: stretch; }
  .toggle-group { width: 100%; }
  .toggle-btn { flex: 1; padding: 0.75rem 1rem; }
  .coin-header-container { flex-wrap: wrap; }
}
`;

// ============================================
// API Configuration & Caching
// ============================================

const cache = {
  data: {},
  set: function(key, value, ttl = 180000) {
    this.data[key] = { value, expiry: Date.now() + ttl };
  },
  get: function(key) {
    const item = this.data[key];
    if (!item) return null;
    if (Date.now() > item.expiry) {
      delete this.data[key];
      return null;
    }
    return item.value;
  }
};

class RequestQueue {
  constructor(delayMs = 1000) {
    this.queue = [];
    this.processing = false;
    this.delayMs = delayMs;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    const { fn, resolve, reject } = this.queue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    await new Promise(r => setTimeout(r, this.delayMs));
    this.processing = false;
    if (this.queue.length > 0) this.process();
  }
}

const requestQueue = new RequestQueue(1000);

const TOP_COINS_MOCK = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "tether", name: "Tether", symbol: "USDT" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "usd-coin", name: "USDC", symbol: "USDC" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "bitcoin-cash", name: "Bitcoin Cash", symbol: "BCH" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "cosmos", name: "Cosmos", symbol: "ATOM" },
  { id: "monero", name: "Monero", symbol: "XMR" },
  { id: "ethereum-classic", name: "Ethereum Classic", symbol: "ETC" },
  { id: "filecoin", name: "Filecoin", symbol: "FIL" },
  { id: "hedera-hashgraph", name: "Hedera", symbol: "HBAR" },
  { id: "internet-computer", name: "Internet Computer", symbol: "ICP" },
  { id: "aptos", name: "Aptos", symbol: "APT" },
  { id: "vechain", name: "VeChain", symbol: "VET" },
  { id: "algorand", name: "Algorand", symbol: "ALGO" },
  { id: "near", name: "NEAR Protocol", symbol: "NEAR" },
  { id: "optimism", name: "Optimism", symbol: "OP" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  { id: "aave", name: "Aave", symbol: "AAVE" },
  { id: "the-graph", name: "The Graph", symbol: "GRT" },
  { id: "immutable-x", name: "Immutable", symbol: "IMX" },
  { id: "injective-protocol", name: "Injective", symbol: "INJ" },
  { id: "maker", name: "Maker", symbol: "MKR" },
  { id: "render-token", name: "Render", symbol: "RNDR" },
  { id: "sui", name: "Sui", symbol: "SUI" },
  { id: "fantom", name: "Fantom", symbol: "FTM" },
  { id: "flow", name: "Flow", symbol: "FLOW" },
  { id: "sandbox", name: "The Sandbox", symbol: "SAND" },
  { id: "axie-infinity", name: "Axie Infinity", symbol: "AXS" },
  { id: "decentraland", name: "Decentraland", symbol: "MANA" },
  { id: "eos", name: "EOS", symbol: "EOS" },
  { id: "tezos", name: "Tezos", symbol: "XTZ" },
  { id: "theta-token", name: "Theta Network", symbol: "THETA" },
  { id: "elrond-erd-2", name: "MultiversX", symbol: "EGLD" },
  { id: "kucoin-shares", name: "KuCoin Token", symbol: "KCS" },
  { id: "neo", name: "Neo", symbol: "NEO" },
  { id: "zilliqa", name: "Zilliqa", symbol: "ZIL" }
];

const get100Coins = async () => {
  const cached = cache.get('coin_list');
  if (cached) return cached;
  
  return requestQueue.add(async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
      );
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      cache.set('coin_list', data, 300000);
      return data;
    } catch (e) {
      console.warn("Using mock coin list");
      return TOP_COINS_MOCK;
    }
  });
};

const getCoinData = async (id) => {
  const cacheKey = `coin_${id}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  return requestQueue.add(async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
      );
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      cache.set(cacheKey, data, 180000);
      return data;
    } catch (e) {
      return {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        symbol: id.substring(0, 3).toUpperCase(),
        description: { en: `Data for ${id}.` },
        image: { large: `https://ui-avatars.com/api/?name=${id}&background=random&rounded=true` },
        market_data: { 
          current_price: { usd: 1000 }, 
          market_cap: { usd: 1000000000 },
          price_change_percentage_24h: 0,
          total_volume: { usd: 50000000 }
        }
      };
    }
  });
};

const getCoinPrices = async (id, days, priceType) => {
  const cacheKey = `prices_${id}_${days}_${priceType}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  return requestQueue.add(async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
      );
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      const prices = data[priceType];
      cache.set(cacheKey, prices, 120000);
      return prices;
    } catch (e) {
      const prices = [];
      const now = Date.now();
      let price = 1000;
      for (let i = days; i >= 0; i--) {
        price = price * (1 + (Math.random() * 0.1 - 0.05));
        prices.push([now - i * 86400000, price]);
      }
      return prices;
    }
  });
};

// ============================================
// Enhanced Chart Component
// ============================================

const EnhancedCompareChart = ({ data1, data2, coin1Name, coin2Name, color1 = "#3b82f6", color2 = "#8b5cf6" }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !data1?.length || !data2?.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '400px';
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 400;
    const padding = 60;

    // Get data ranges
    const prices1 = data1.map(d => d.y);
    const prices2 = data2.map(d => d.y);
    const min1 = Math.min(...prices1);
    const max1 = Math.max(...prices1);
    const min2 = Math.min(...prices2);
    const max2 = Math.max(...prices2);
    const minTime = data1[0].x;
    const maxTime = data1[data1.length - 1].x;

    // Scale functions
    const getX = (time) => ((time - minTime) / (maxTime - minTime)) * (width - padding * 2) + padding;
    const getY1 = (price) => height - ((price - min1) / (max1 - min1)) * (height - padding * 2) - padding;
    const getY2 = (price) => height - ((price - min2) / (max2 - min2)) * (height - padding * 2) - padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding) / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw gradients
    const gradient1 = ctx.createLinearGradient(0, 0, 0, height);
    gradient1.addColorStop(0, color1 + '40');
    gradient1.addColorStop(1, color1 + '05');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, height);
    gradient2.addColorStop(0, color2 + '40');
    gradient2.addColorStop(1, color2 + '05');

    // Draw filled areas
    ctx.fillStyle = gradient1;
    ctx.beginPath();
    ctx.moveTo(getX(data1[0].x), height - padding);
    data1.forEach(d => ctx.lineTo(getX(d.x), getY1(d.y)));
    ctx.lineTo(getX(data1[data1.length - 1].x), height - padding);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = gradient2;
    ctx.beginPath();
    ctx.moveTo(getX(data2[0].x), height - padding);
    data2.forEach(d => ctx.lineTo(getX(d.x), getY2(d.y)));
    ctx.lineTo(getX(data2[data2.length - 1].x), height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw lines
    ctx.strokeStyle = color1;
    ctx.lineWidth = 3;
    ctx.beginPath();
    data1.forEach((d, i) => {
      const x = getX(d.x);
      const y = getY1(d.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.strokeStyle = color2;
    ctx.beginPath();
    data2.forEach((d, i) => {
      const x = getX(d.x);
      const y = getY2(d.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw axes labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.fillText(new Date(minTime).toLocaleDateString(), padding, height - 20);
    ctx.fillText(new Date(maxTime).toLocaleDateString(), width - padding - 80, height - 20);

  }, [data1, data2, color1, color2]);

  if (!data1?.length || !data2?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-grey)' }}>
        <RefreshCw className="spinner" size={40} style={{ margin: '0 auto 1rem' }} />
        <p>Loading chart data...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '16px', height: '3px', background: color1, borderRadius: '2px' }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{coin1Name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '16px', height: '3px', background: color2, borderRadius: '2px' }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{coin2Name}</span>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

// ============================================
// Stat Card Component
// ============================================

const StatCard = ({ label, value, change, color }) => {
  const isPositive = change >= 0;
  return (
    <div className="stat-card">
      <p style={{ fontSize: '0.85rem', color: 'var(--text-grey)', marginBottom: '0.5rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
        {value}
      </p>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.25rem',
        color: isPositive ? 'var(--success)' : 'var(--danger)',
        fontSize: '0.85rem',
        fontWeight: '600'
      }}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {isPositive ? '+' : ''}{change?.toFixed(2)}%
      </div>
    </div>
  );
};

// ============================================
// Coin Comparison Card
// ============================================

const CoinComparisonCard = ({ coin, color, isWinner }) => (
  <div className="grey-wrapper fade-in">
    <div className="coin-header-container">
      <img src={coin.image?.large} alt={coin.name} className="coin-logo" style={{ borderColor: color }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{coin.name}</h3>
          <span style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-grey)', 
            fontWeight: '600',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.25rem 0.75rem',
            borderRadius: '2rem',
            border: '1px solid var(--glass-border)'
          }}>
            {coin.symbol}
          </span>
          {isWinner !== undefined && (
            <span className={isWinner ? 'comparison-badge badge-winner' : 'comparison-badge badge-loser'}>
              {isWinner ? '🏆 Higher 24h' : '📉 Lower 24h'}
            </span>
          )}
        </div>
      </div>
    </div>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <StatCard 
        label="Price"
        value={`$${coin.market_data?.current_price?.usd?.toLocaleString()}`}
        change={coin.market_data?.price_change_percentage_24h || 0}
      />
      <StatCard 
        label="Market Cap"
        value={`$${(coin.market_data?.market_cap?.usd / 1e9)?.toFixed(2)}B`}
        change={coin.market_data?.price_change_percentage_24h || 0}
      />
      <StatCard 
        label="24h Volume"
        value={`$${(coin.market_data?.total_volume?.usd / 1e6)?.toFixed(2)}M`}
        change={coin.market_data?.price_change_percentage_24h || 0}
      />
    </div>

    <div style={{ 
      color: 'var(--text-grey)', 
      fontSize: '0.9rem', 
      lineHeight: '1.7',
      borderTop: '1px solid var(--glass-border)',
      paddingTop: '1.5rem'
    }}>
      <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1rem' }}>About</h4>
      {coin.description?.en?.replace(/(<([^>]+)>)/gi, "").split('. ').slice(0, 2).join('. ') + '.'}
    </div>
  </div>
);

// ============================================
// Select Component
// ============================================

const SelectCoin = ({ allCoins, coin1, coin2, onCoinChange, loading }) => (
  <div className="compare-selectors">
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.75rem', 
        color: 'var(--text-grey)',
        fontSize: '0.9rem',
        fontWeight: '600'
      }}>
        Cryptocurrency 1
      </label>
      <select 
        value={coin1} 
        onChange={(e) => onCoinChange(e.target.value, true)}
        className="custom-select"
        disabled={loading}
      >
        {allCoins.map(coin => (
          <option key={coin.id} value={coin.id} disabled={coin.id === coin2}>
            {coin.name} ({coin.symbol?.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.75rem', 
        color: 'var(--text-grey)',
        fontSize: '0.9rem',
        fontWeight: '600'
      }}>
        Cryptocurrency 2
      </label>
      <select 
        value={coin2} 
        onChange={(e) => onCoinChange(e.target.value, false)}
        className="custom-select"
        disabled={loading}
      >
        {allCoins.map(coin => (
          <option key={`c2-${coin.id}`} value={coin.id} disabled={coin.id === coin1}>
            {coin.name} ({coin.symbol?.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  </div>
);

// ============================================
// Loader Component
// ============================================

const FancyLoader = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1.5rem'
  }}>
    <RefreshCw className="spinner" size={48} style={{ color: 'var(--primary-blue)' }} />
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
        Comparing Assets
      </p>
      <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem' }}>
        Fetching real-time data...
      </p>
    </div>
  </div>
);

// ============================================
// Main Compare Page
// ============================================

function ComparePage() {
  const [allCoins, setAllCoins] = useState([]);
  const [coin1, setCoin1] = useState("bitcoin");
  const [coin2, setCoin2] = useState("ethereum");
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  
  const [coin1Data, setCoin1Data] = useState(null);
  const [coin2Data, setCoin2Data] = useState(null);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // Fetch coin list
  useEffect(() => {
    const fetchCoins = async () => {
      const data = await get100Coins();
      setAllCoins(data);
    };
    fetchCoins();
  }, []);

  // Fetch comparison data
  useEffect(() => {
    fetchComparisonData();
  }, [coin1, coin2, days, priceType]);

  const fetchComparisonData = async () => {
    setChartLoading(true);
    
    try {
      const [c1, c2, p1, p2] = await Promise.all([
        getCoinData(coin1),
        getCoinData(coin2),
        getCoinPrices(coin1, days, priceType),
        getCoinPrices(coin2, days, priceType)
      ]);

      setCoin1Data(c1);
      setCoin2Data(c2);
      
      if (p1) setChartData1(p1.map(item => ({ x: item[0], y: item[1] })));
      if (p2) setChartData2(p2.map(item => ({ x: item[0], y: item[1] })));
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  const handleCoinChange = useCallback((newId, isCoin1) => {
    if (isCoin1) setCoin1(newId);
    else setCoin2(newId);
  }, []);

  const handleDaysChange = useCallback((e) => {
    setDays(parseInt(e.target.value));
  }, []);

  const handleTypeChange = useCallback((type) => {
    setPriceType(type);
  }, []);

  const coin1Winner = useMemo(() => {
    if (!coin1Data || !coin2Data) return undefined;
    const change1 = coin1Data.market_data?.price_change_percentage_24h || 0;
    const change2 = coin2Data.market_data?.price_change_percentage_24h || 0;
    return change1 > change2;
  }, [coin1Data, coin2Data]);

  if (loading && !coin1Data) {
    return (
      <>
        <style>{styles}</style>
        <div className="dashboard-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Activity size={32} style={{ color: 'var(--primary-blue)' }} />
            <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              Compare Cryptocurrencies
            </span>
          </div>
          <FancyLoader />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-wrapper">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--glass-border)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={32} style={{ color: 'var(--primary-blue)' }} />
            <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              Compare Cryptocurrencies
            </span>
          </div>
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'var(--glass-highlight)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </motion.header>

        {/* Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SelectCoin 
            allCoins={allCoins} 
            coin1={coin1} 
            coin2={coin2} 
            onCoinChange={handleCoinChange}
            loading={chartLoading}
          />
        </motion.div>

        {/* Chart Section */}
        <AnimatePresence mode="wait">
          {coin1Data && coin2Data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grey-wrapper">
                <div className="chart-controls">
                  <div className="toggle-group">
                    <button 
                      className={`toggle-btn ${priceType === 'prices' ? 'active' : ''}`}
                      onClick={() => handleTypeChange('prices')}
                      disabled={chartLoading}
                    >
                      Price
                    </button>
                    <button 
                      className={`toggle-btn ${priceType === 'market_caps' ? 'active' : ''}`}
                      onClick={() => handleTypeChange('market_caps')}
                      disabled={chartLoading}
                    >
                      Market Cap
                    </button>
                    <button 
                      className={`toggle-btn ${priceType === 'total_volumes' ? 'active' : ''}`}
                      onClick={() => handleTypeChange('total_volumes')}
                      disabled={chartLoading}
                    >
                      Volume
                    </button>
                  </div>

                  <select 
                    value={days} 
                    onChange={handleDaysChange} 
                    className="custom-select" 
                    style={{ width: 'auto', minWidth: '150px' }}
                    disabled={chartLoading}
                  >
                    <option value={1}>24 Hours</option>
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 3 Months</option>
                    <option value={180}>Last 6 Months</option>
                    <option value={365}>Last 1 Year</option>
                  </select>
                </div>
                
                {chartLoading ? (
                  <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <RefreshCw className="spinner" size={40} style={{ color: 'var(--primary-blue)', margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-grey)' }}>Updating chart...</p>
                  </div>
                ) : (
                  <EnhancedCompareChart 
                    data1={chartData1} 
                    data2={chartData2}
                    coin1Name={coin1Data.name}
                    coin2Name={coin2Data.name}
                    color1="#3b82f6" 
                    color2="#8b5cf6" 
                  />
                )}
              </div>

              {/* Comparison Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '2rem',
                marginTop: '2rem'
              }}>
                <CoinComparisonCard 
                  coin={coin1Data} 
                  color="#3b82f6"
                  isWinner={coin1Winner}
                />
                <CoinComparisonCard 
                  coin={coin2Data} 
                  color="#8b5cf6"
                  isWinner={coin1Winner === false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ComparePage;