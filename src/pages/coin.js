import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

// ============================================
// SCOPED STYLES (ISOLATED)
// ============================================

const scopedStyles = `
  /* Define distinct variables for this component only */
  .cp-container {
    --cp-bg-dark: #0f1115;
    --cp-bg-card: #181b21;
    --cp-text-primary: #ffffff;
    --cp-text-secondary: #9ca3af;
    --cp-accent-blue: #3b82f6;
    --cp-accent-green: #10b981;
    --cp-accent-red: #ef4444;
    --cp-grid-line: rgba(255, 255, 255, 0.05);
    
    font-family: 'Inter', sans-serif;
    background-color: var(--cp-bg-dark);
    min-height: 100vh;
    color: var(--cp-text-primary);
  }

  /* Utilities */
  .cp-font-mono { font-family: 'JetBrains Mono', monospace; }
  .cp-fade-in { animation: cpFadeIn 0.6s ease-out forwards; }
  
  @keyframes cpSpin { to { transform: rotate(360deg); } }
  @keyframes cpFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .cp-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--cp-accent-blue);
    border-radius: 50%;
    animation: cpSpin 1s linear infinite;
  }

  .cp-card {
    background: var(--cp-bg-card);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  /* List / Hero Section Styles */
  .cp-hero-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .cp-hero-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cp-hero-right {
    text-align: right;
  }
  
  .cp-hero-price {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -1px;
    color: var(--cp-text-primary);
    white-space: nowrap;
  }

  /* Chart Controls Styles */
  .cp-chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 2rem;
  }

  .cp-controls-wrapper {
    display: flex;
    gap: 1rem;
  }

  .cp-price-toggle-group {
    display: flex;
    gap: 0.5rem;
    background: rgba(0,0,0,0.2);
    padding: 4px;
    border-radius: 8px;
  }

  /* Chart Specific Styles */
  .cp-chart-container {
    position: relative;
    cursor: crosshair;
    overflow: hidden;
  }

  .cp-chart-tooltip {
    position: absolute;
    background: rgba(24, 27, 33, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    padding: 8px 12px;
    border-radius: 8px;
    pointer-events: none;
    transform: translate(-50%, -120%);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    z-index: 10;
    min-width: 140px;
    transition: opacity 0.1s ease;
  }

  .cp-stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--cp-grid-line);
  }

  .cp-stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .cp-stat-label { font-size: 0.75rem; color: var(--cp-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
  .cp-stat-value { font-size: 1rem; font-weight: 600; color: var(--cp-text-primary); }

  /* MOBILE RESPONSIVE TWEAKS */
  @media (max-width: 768px) {
    .cp-hero-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
    }
    
    .cp-hero-right {
        text-align: left;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .cp-hero-price {
        font-size: 2rem; /* Reduce size */
        white-space: normal;
        word-break: break-word;
    }

    /* Stack the Chart Header */
    .cp-chart-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .cp-controls-wrapper {
        flex-direction: column;
        width: 100%;
        gap: 0.75rem;
    }

    /* Make toggle buttons fill width */
    .cp-price-toggle-group {
        width: 100%;
        box-sizing: border-box;
    }

    .cp-price-toggle-group button {
        flex: 1;
        font-size: 0.75rem;
        padding: 6px 4px !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Adjust stat grid for smaller screens */
    .cp-stat-grid {
        grid-template-columns: repeat(2, 1fr);
    }
  }
`;

// Inject styles safely
if (typeof document !== 'undefined' && !document.getElementById('coin-page-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'coin-page-styles';
  styleSheet.textContent = scopedStyles;
  document.head.appendChild(styleSheet);
}

// ============================================
// Components
// ============================================

const CoinInfo = ({ name, desc }) => (
  <div className="cp-card cp-fade-in" style={{ animationDelay: "0.3s" }}>
    <h2 style={{ color: "var(--cp-text-primary)", marginBottom: "1rem", fontSize: "1.25rem", fontWeight: 600 }}>
      About {name}
    </h2>
    <p
      style={{
        color: "var(--cp-text-secondary)",
        lineHeight: "1.7",
        fontSize: "0.95rem"
      }}
      dangerouslySetInnerHTML={{
        __html: desc ? desc.substring(0, 400) + "..." : "No description available."
      }}
    />
  </div>
);

const LineChart = ({ chartData, priceType, isLoading }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);
  
  const stats = useMemo(() => {
    if (!chartData.datasets[0]?.data?.length) return null;
    const values = chartData.datasets[0].data;
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      current: values[values.length - 1],
      first: values[0]
    };
  }, [chartData]);

  const changePercent = stats 
    ? (((stats.current - stats.first) / stats.first) * 100).toFixed(2) 
    : 0;
  const isPositive = changePercent >= 0;
  const lineColor = isPositive ? "#10b981" : "#ef4444";

  // Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.labels?.length || isLoading) return;

    const ctx = canvas.getContext('2d');
    const values = chartData.datasets[0]?.data || [];
    
    const dpr = window.devicePixelRatio || 1;
    if(!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = 350 * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `350px`;

    const width = rect.width;
    const height = 350;

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = (maxValue - minValue) * 0.15;
    const range = maxValue - minValue + (padding * 2);

    const getX = (index) => (width / (values.length - 1)) * index;
    const getY = (val) => height - ((val - minValue + padding) / range) * height;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
        const y = (height / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const rgbColor = isPositive ? '16, 185, 129' : '239, 68, 68'; 
    gradient.addColorStop(0, `rgba(${rgbColor}, 0.25)`);
    gradient.addColorStop(1, `rgba(${rgbColor}, 0.01)`);

    // Area
    ctx.beginPath();
    ctx.moveTo(0, height);
    values.forEach((val, i) => {
        ctx.lineTo(getX(i), getY(val));
    });
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${rgbColor}, 0.5)`;

    values.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Crosshair
    if (hoverData) {
        const { index } = hoverData;
        const snapX = getX(index);
        const snapY = getY(values[index]);

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.moveTo(snapX, 0);
        ctx.lineTo(snapX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(snapX, snapY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(snapX, snapY, 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbColor}, 0.3)`;
        ctx.fill();
    }

  }, [chartData, isLoading, hoverData, isPositive]);

  const handleMouseMove = useCallback((e) => {
    if(!containerRef.current || !chartData.datasets[0]) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    const values = chartData.datasets[0].data;
    const index = Math.min(
        Math.max(0, Math.round((x / width) * (values.length - 1))), 
        values.length - 1
    );

    setHoverData({
        x,
        y: e.clientY - rect.top,
        index,
        value: values[index],
        date: chartData.labels[index]
    });
  }, [chartData]);

  const handleMouseLeave = () => setHoverData(null);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="cp-card">
      {isLoading ? (
        <div style={{ height: "450px", display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <div className="cp-spinner"></div>
          <p style={{ color: "var(--cp-text-secondary)" }}>Analyzing market data...</p>
        </div>
      ) : stats ? (
        <>
            <div className="cp-stat-grid">
                <div className="cp-stat-item">
                    <span className="cp-stat-label">Current Price</span>
                    <span className={`cp-stat-value cp-font-mono`} style={{ color: lineColor }}>
                        {formatCurrency(stats.current)}
                    </span>
                </div>
                <div className="cp-stat-item">
                    <span className="cp-stat-label">Period Change</span>
                    <span className="cp-stat-value cp-font-mono" style={{ color: lineColor }}>
                        {isPositive ? "+" : ""}{changePercent}%
                    </span>
                </div>
                <div className="cp-stat-item">
                    <span className="cp-stat-label">High</span>
                    <span className="cp-stat-value cp-font-mono">{formatCurrency(stats.max)}</span>
                </div>
                <div className="cp-stat-item">
                    <span className="cp-stat-label">Low</span>
                    <span className="cp-stat-value cp-font-mono">{formatCurrency(stats.min)}</span>
                </div>
                <div className="cp-stat-item">
                    <span className="cp-stat-label">Average</span>
                    <span className="cp-stat-value cp-font-mono">{formatCurrency(stats.avg)}</span>
                </div>
            </div>

            <div 
                ref={containerRef}
                className="cp-chart-container" 
                style={{ height: "350px", width: "100%" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <canvas ref={canvasRef} />
                
                {hoverData && (
                    <div 
                        className="cp-chart-tooltip"
                        style={{ 
                            left: hoverData.x, 
                            top: 100 
                        }}
                    >
                        <div style={{ color: "var(--cp-text-secondary)", fontSize: "0.75rem", marginBottom: "4px" }}>
                            {hoverData.date}
                        </div>
                        <div className="cp-font-mono" style={{ color: "#fff", fontWeight: "bold" }}>
                            {formatCurrency(hoverData.value)}
                        </div>
                    </div>
                )}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.75rem", color: "var(--cp-text-secondary)" }}>
                <span>{chartData.labels[0]}</span>
                <span>{chartData.labels[Math.floor(chartData.labels.length / 2)]}</span>
                <span>{chartData.labels[chartData.labels.length - 1]}</span>
            </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--cp-text-secondary)" }}>
          No chart data available
        </div>
      )}
    </div>
  );
};

const PriceToggle = ({ handlePriceTypeChange, priceType, disabled }) => (
  <div className="cp-price-toggle-group">
    {["prices", "market_caps", "total_volumes"].map((type) => (
        <button
            key={type}
            onClick={() => handlePriceTypeChange({ target: { value: type }})}
            disabled={disabled}
            style={{
                background: priceType === type ? "rgba(255,255,255,0.1)" : "transparent",
                color: priceType === type ? "#fff" : "var(--cp-text-secondary)",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize"
            }}
        >
            {type.replace("_", " ").replace("total", "")}
        </button>
    ))}
  </div>
);

const SelectDays = ({ days, handleDaysChange, disabled }) => (
  <select
    value={days}
    onChange={handleDaysChange}
    disabled={disabled}
    style={{
        background: "rgba(0,0,0,0.2)",
        color: "var(--cp-text-primary)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "0.85rem",
        outline: "none",
        cursor: "pointer",
        minWidth: "100px" // Ensure it doesn't shrink too much
    }}
  >
    <option value={1}>24 Hours</option>
    <option value={7}>7 Days</option>
    <option value={30}>30 Days</option>
    <option value={90}>3 Months</option>
    <option value={365}>1 Year</option>
  </select>
);

const Footer = () => (
  <footer style={{
    color: "var(--cp-text-secondary)",
    marginTop: "3rem",
    padding: "2rem",
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)"
  }}>
    <p style={{ fontSize: "0.85rem" }}>Powered by CoinGecko API • Real-time Data</p>
  </footer>
);

const Header = () => {
  const goBack = () => {
    if(window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
  };

  return (
    <header style={{
      marginBottom: "2rem",
      padding: "1.25rem 2rem",
      borderBottom: "1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "var(--header-bg, rgba(15, 17, 21, 0.85))",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)"
    }}>
      <button
        onClick={goBack}
        aria-label="Back to Dashboard"
        style={{
          background: "var(--button-bg, rgba(255, 255, 255, 0.06))",
          border: "1px solid var(--button-border, rgba(255, 255, 255, 0.1))",
          color: "var(--text-primary, #ffffff)",
          padding: "0.625rem 1.25rem",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          fontSize: "0.9375rem",
          fontWeight: "500"
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = "var(--button-bg-hover, rgba(255, 255, 255, 0.12))";
          e.currentTarget.style.transform = "translateX(-2px)";
          e.currentTarget.style.borderColor = "var(--button-border-hover, rgba(255, 255, 255, 0.2))";
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = "var(--button-bg, rgba(255, 255, 255, 0.06))";
          e.currentTarget.style.transform = "translateX(0)";
          e.currentTarget.style.borderColor = "var(--button-border, rgba(255, 255, 255, 0.1))";
        }}
        onMouseDown={e => e.currentTarget.style.transform = "translateX(-2px) scale(0.95)"}
        onMouseUp={e => e.currentTarget.style.transform = "translateX(-2px)"}
      >
        <span style={{ fontSize: "1.1rem" }}>←</span>
        Back to Dashboard
      </button>

      <h1 style={{ 
        fontSize: "1.375rem", 
        fontWeight: "600", 
        margin: 0, 
        color: "var(--text-primary, #ffffff)",
        letterSpacing: "-0.025em",
        background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textAlign: "right"
      }}>
        Crypto Vision
      </h1>
    </header>
  );
};

const Loader = () => (
  <div style={{
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem"
  }}>
    <div className="cp-spinner"></div>
    <p style={{ color: "var(--cp-text-secondary)", fontSize: "1.1rem" }}>Loading assets...</p>
  </div>
);

const List = ({ coin, delay = 0 }) => (
  // Updated with classes for responsive control
  <div className="cp-card cp-fade-in cp-hero-card" style={{ animationDelay: `${delay}s` }}>
    <div className="cp-hero-left">
      {coin.image && (
        <img
          src={coin.image}
          alt={coin.name}
          style={{ width: "64px", height: "64px", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
        />
      )}
      <div>
        <h3 style={{ fontSize: "2rem", fontWeight: "700", margin: 0, color: "var(--cp-text-primary)" }}>
          {coin.name}
        </h3>
        <span style={{
          color: "var(--cp-text-secondary)",
          textTransform: "uppercase",
          fontSize: "1rem",
          fontWeight: 600,
          background: "rgba(255,255,255,0.05)",
          padding: "2px 8px",
          borderRadius: "4px"
        }}>
          {coin.symbol}
        </span>
      </div>
    </div>
    
    <div className="cp-hero-right">
         <p className="cp-hero-price">
           ${coin.current_price?.toLocaleString()}
         </p>
         <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem" }}>
            <span style={{ 
               color: coin.price_change_percentage_24h >= 0 ? "var(--cp-accent-green)" : "var(--cp-accent-red)",
               fontWeight: 600,
               background: coin.price_change_percentage_24h >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
               padding: "4px 8px",
               borderRadius: "6px",
               fontSize: "0.9rem"
           }}>
               {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)
           </span>
         </div>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div style={{
    background: "rgba(239, 68, 68, 0.05)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "16px",
    padding: "3rem",
    margin: "2rem auto",
    textAlign: "center",
    maxWidth: "600px"
  }}>
    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
    <h3 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>Data Unavailable</h3>
    <p style={{ color: "var(--cp-text-secondary)", marginBottom: "2rem" }}>{message}</p>
    <button
      onClick={onRetry}
      style={{
        padding: "0.75rem 2rem",
        background: "var(--cp-accent-blue)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "opacity 0.2s"
      }}
    >
      Retry Connection
    </button>
  </div>
);

// ============================================
// API Configuration & Caching
// ============================================

const API_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  useCorsProxy: false, 
  corsProxyUrl: 'https://api.allorigins.win/raw?url=',
};

const buildApiUrl = (endpoint) => {
  if (API_CONFIG.useCorsProxy) {
    return `${API_CONFIG.corsProxyUrl}${encodeURIComponent(`https://api.coingecko.com/api/v3${endpoint}`)}`;
  }
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

const cache = {
  data: {},
  set: function (key, value, ttl = 300000) {
    this.data[key] = { value, expiry: Date.now() + ttl };
  },
  get: function (key) {
    const item = this.data[key];
    if (!item) return null;
    if (Date.now() > item.expiry) {
      delete this.data[key];
      return null;
    }
    return item.value;
  },
  clear: function () { this.data = {}; }
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

const requestQueue = new RequestQueue(1200);

// ============================================
// Data Fetching Logic
// ============================================

const coinObject = (setCoin, data) => {
  if (!data) return;
  setCoin({
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    desc: data.description?.en,
    image: data.image?.large,
    current_price: data.market_data?.current_price?.usd,
    market_cap: data.market_data?.market_cap?.usd,
    price_change_percentage_24h: data.market_data?.price_change_percentage_24h,
  });
};

const getCoinData = async (id) => {
  const cacheKey = `coin_${id}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  return requestQueue.add(async () => {
    try {
      const url = buildApiUrl(`/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`);
      const response = await fetch(url);
      if (response.status === 429) throw new Error("Rate limit exceeded.");
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      cache.set(cacheKey, data, 300000);
      return data;
    } catch (error) {
      throw error;
    }
  });
};

const getCoinPrices = async (id, days, priceType) => {
  const cacheKey = `prices_${id}_${days}_${priceType}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  return requestQueue.add(async () => {
    try {
      const url = buildApiUrl(`/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
      const response = await fetch(url);
      if (response.status === 429) throw new Error("Rate limit exceeded.");
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      const prices = data[priceType];
      cache.set(cacheKey, prices, 120000);
      return prices;
    } catch (error) {
      throw error;
    }
  });
};

const settingChartData = (setChartData, prices, coinData) => {
  if (!prices || !coinData) return;
  setChartData({
    labels: prices.map((item) => {
      const date = new Date(item[0]);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [{
        label: coinData.name,
        data: prices.map((item) => item[1]),
    }],
  });
};

// ============================================
// Main Application Component
// ============================================

function CoinPage() {
  const getIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    const coinId = pathParts[pathParts.length - 1];
    return coinId || "bitcoin"; 
  };

  const id = getIdFromUrl();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const debounceTimeout = useRef(null);
  const abortController = useRef(null);

  useEffect(() => {
    if (id) {
      setCoin(null);
      setChartData({ labels: [], datasets: [] });
      getData();
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (abortController.current) abortController.current.abort();
    };
  }, [id]);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCoinData(id);
      if (data) {
        coinObject(setCoin, data);
        const prices = await getCoinPrices(id, days, priceType);
        if (prices) settingChartData(setChartData, prices, data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load coin data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDebouncedPrices = useCallback((newDays, newPriceType) => {
    setChartLoading(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    debounceTimeout.current = setTimeout(async () => {
      try {
        const prices = await getCoinPrices(id, newDays, newPriceType);
        if (prices && coin) settingChartData(setChartData, prices, coin);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setChartLoading(false);
      }
    }, 500);
  }, [id, coin]);

  const handleDaysChange = (event) => {
    const newDays = parseInt(event.target.value);
    setDays(newDays);
    fetchDebouncedPrices(newDays, priceType);
  };

  const handlePriceTypeChange = (event) => {
    const newPriceType = event.target.value;
    setPriceType(newPriceType);
    fetchDebouncedPrices(days, newPriceType);
  };

  return (
    // Applied "cp-container" here to act as the "body" for this component
    <div className="cp-container">
      <Header />
      {error ? (
        <ErrorMessage message={error} onRetry={getData} />
      ) : loading ? (
        <Loader />
      ) : coin ? (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          
          <List coin={coin} delay={0.1} />

          {/* Updated Header Structure with Classes */}
          <div className="cp-chart-header">
             <h3 style={{ margin: 0, color: "var(--cp-text-primary)" }}>Market Performance</h3>
             <div className="cp-controls-wrapper">
                <SelectDays days={days} handleDaysChange={handleDaysChange} disabled={chartLoading} />
                <PriceToggle handlePriceTypeChange={handlePriceTypeChange} priceType={priceType} disabled={chartLoading} />
             </div>
          </div>

          <LineChart chartData={chartData} priceType={priceType} isLoading={chartLoading} />
          <CoinInfo name={coin.name} desc={coin.desc} />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--cp-text-secondary)" }}>
          No data available
        </div>
      )}
      <Footer />
    </div>
  );
}

export default CoinPage;