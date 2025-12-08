import React, { useEffect, useState, useRef, useCallback } from "react";

const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--blue, #6366f1);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .grey-wrapper {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================
// Placeholder Components
// ============================================

const CoinInfo = ({ name, desc }) => (
  <div className="grey-wrapper fade-in" style={{ animationDelay: "0.3s" }}>
    <h2 style={{ color: "var(--white)", marginBottom: "1rem", fontSize: "1.5rem" }}>
      About {name}
    </h2>
    <p
      style={{
        color: "var(--grey)",
        lineHeight: "1.6",
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
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !chartData.labels?.length || isLoading) return;

    const ctx = canvasRef.current.getContext('2d');

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Find min and max values for better scaling
    const values = chartData.datasets[0]?.data || [];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = (maxValue - minValue) * 0.1;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

    // Draw the chart
    const drawChart = () => {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      ctx.clearRect(0, 0, width, height);

      if (values.length === 0) return;

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw filled area
      ctx.fillStyle = gradient;
      ctx.beginPath();
      values.forEach((value, index) => {
        const x = (width / (values.length - 1)) * index;
        const y = height - ((value - minValue + padding) / (maxValue - minValue + padding * 2)) * height;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      values.forEach((value, index) => {
        const x = (width / (values.length - 1)) * index;
        const y = height - ((value - minValue + padding) / (maxValue - minValue + padding * 2)) * height;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      ctx.fillStyle = '#6366f1';
      values.forEach((value, index) => {
        const x = (width / (values.length - 1)) * index;
        const y = height - ((value - minValue + padding) / (maxValue - minValue + padding * 2)) * height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvasRef.current.parentElement;
      canvasRef.current.width = container.offsetWidth - 48;
      canvasRef.current.height = 350;
      drawChart();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    chartInstance.current = { destroy: () => { } };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [chartData, isLoading]);

  const priceLabel = priceType === "prices" ? "Price" : priceType === "market_caps" ? "Market Cap" : "Volume";
  const currentValue = chartData.datasets[0]?.data?.[chartData.datasets[0].data.length - 1];
  const firstValue = chartData.datasets[0]?.data?.[0];
  const changePercent = firstValue ? (((currentValue - firstValue) / firstValue) * 100).toFixed(2) : 0;
  const isPositive = changePercent >= 0;

  return (
    <div style={{
      color: "var(--white)",
      padding: "1.5rem",
      background: "rgba(255, 255, 255, 0.02)",
      borderRadius: "12px",
      minHeight: "400px"
    }}>
      {isLoading ? (
        <div style={{
          textAlign: "center",
          padding: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div className="spinner"></div>
          <p style={{ color: "var(--grey)" }}>Updating chart...</p>
        </div>
      ) : chartData.labels?.length > 0 ? (
        <>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <h3 style={{ fontSize: "0.9rem", color: "var(--grey)", marginBottom: "0.5rem" }}>
                {priceLabel}
              </h3>
              <p style={{ fontSize: "2rem", fontWeight: "700" }}>
                ${currentValue?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--grey)", marginBottom: "0.5rem" }}>
                Change
              </p>
              <p style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: isPositive ? "#10b981" : "#ef4444"
              }}>
                {isPositive ? "+" : ""}{changePercent}%
              </p>
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", height: "350px" }}>
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px"
              }}
            />
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
            fontSize: "0.85rem",
            color: "var(--grey)"
          }}>
            <span>{chartData.labels[0]}</span>
            <span>{chartData.labels[Math.floor(chartData.labels.length / 2)]}</span>
            <span>{chartData.labels[chartData.labels.length - 1]}</span>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--grey)" }}>
          No chart data available
        </div>
      )}
    </div>
  );
};

const PriceToggle = ({ handlePriceTypeChange, priceType, disabled }) => (
  <div style={{
    color: "var(--white)",
    margin: "1rem 0",
    display: "flex",
    gap: "1rem",
    alignItems: "center"
  }}>
    <span style={{ color: "var(--grey)", fontSize: "0.9rem" }}>View:</span>
    <label style={{
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="radio"
        value="prices"
        checked={priceType === "prices"}
        onChange={handlePriceTypeChange}
        disabled={disabled}
        style={{ marginRight: "0.5rem" }}
      />
      Prices
    </label>
    <label style={{
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="radio"
        value="market_caps"
        checked={priceType === "market_caps"}
        onChange={handlePriceTypeChange}
        disabled={disabled}
        style={{ marginRight: "0.5rem" }}
      />
      Market Caps
    </label>
    <label style={{
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="radio"
        value="total_volumes"
        checked={priceType === "total_volumes"}
        onChange={handlePriceTypeChange}
        disabled={disabled}
        style={{ marginRight: "0.5rem" }}
      />
      Volume
    </label>
  </div>
);

const SelectDays = ({ days, handleDaysChange, disabled }) => (
  <div style={{
    color: "var(--white)",
    margin: "1rem 0",
    display: "flex",
    gap: "1rem",
    alignItems: "center"
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <label
        htmlFor="time-period"
        style={{
          color: "var(--grey)",
          fontSize: "0.9rem",
          fontWeight: "500"
        }}
      >
        Time Period:
      </label>
      <select
        id="time-period"
        value={days}
        onChange={handleDaysChange}
        disabled={disabled}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          background: "var(--bg-grey, #1a1a1a)",
          color: "var(--white, #ffffff)",
          border: "1px solid var(--border-grey, #333333)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontSize: "0.95rem",
          fontWeight: "500",
          outline: "none",
          transition: "all 0.3s ease",
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          paddingRight: "2.5rem"
        }}
        onMouseOver={(e) => {
          if (!disabled) {
            e.target.style.background = "var(--bg-grey-hover, #222222)";
            e.target.style.borderColor = "var(--border-grey-light, #444444)";
          }
        }}
        onMouseOut={(e) => {
          e.target.style.background = "var(--bg-grey, #1a1a1a)";
          e.target.style.borderColor = "var(--border-grey, #333333)";
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--blue, #3b82f6)";
          e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-grey, #333333)";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value={1} style={{ background: "var(--bg-grey, #1a1a1a)", color: "var(--white, #ffffff)", padding: "0.5rem" }}>
          24 Hours
        </option>
        <option value={7} style={{ background: "var(--bg-grey, #1a1a1a)", color: "var(--white, #ffffff)", padding: "0.5rem" }}>
          7 Days
        </option>
        <option value={30} style={{ background: "var(--bg-grey, #1a1a1a)", color: "var(--white, #ffffff)", padding: "0.5rem" }}>
          30 Days
        </option>
        <option value={60} style={{ background: "var(--bg-grey, #1a1a1a)", color: "var(--white, #ffffff)", padding: "0.5rem" }}>
          60 Days
        </option>
        <option value={120} style={{ background: "var(--bg-grey, #1a1a1a)", color: "var(--white, #ffffff)", padding: "0.5rem" }}>
          120 Days
        </option>
        <option value={365} style={{ background: "var(--bg-grey, #1a1a1a)", color: "var(--white, #ffffff)", padding: "0.5rem" }}>
          1 Year
        </option>
      </select>
    </div>
  </div>
);

const Footer = () => (
  <footer style={{
    color: "var(--grey)",
    marginTop: "3rem",
    padding: "2rem",
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
  }}>
    <p>Powered by CoinGecko API</p>
  </footer>
);

const Header = () => {
  const goBack = () => {
    // Go back to dashboard or coin list
    window.history.back();
  };

  return (
    <header style={{
      color: "var(--white)",
      marginBottom: "2rem",
      padding: "1.5rem 2rem",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }}>
      <button
        onClick={goBack}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "var(--white)",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        ← Back
      </button>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Crypto Tracker</h1>
    </header>
  );
};

const Loader = () => (
  <div style={{
    color: "var(--white)",
    fontSize: "1.5rem",
    textAlign: "center",
    padding: "4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem"
  }}>
    <div className="spinner"></div>
    <p>Loading coin data...</p>
  </div>
);

const List = ({ coin, delay = 0 }) => (
  <div style={{
    color: "var(--white)",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "12px",
    animationDelay: `${delay}s`
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
      {coin.image && (
        <img
          src={coin.image}
          alt={coin.name}
          style={{ width: "48px", height: "48px", borderRadius: "50%" }}
        />
      )}
      <div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
          {coin.name}
        </h3>
        <span style={{
          color: "var(--grey)",
          textTransform: "uppercase",
          fontSize: "0.9rem"
        }}>
          {coin.symbol}
        </span>
      </div>
    </div>
    {coin.current_price && (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "1rem",
        marginTop: "1rem"
      }}>
        <div>
          <p style={{ color: "var(--grey)", fontSize: "0.85rem" }}>Current Price</p>
          <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            ${coin.current_price?.toLocaleString()}
          </p>
        </div>
        <div>
          <p style={{ color: "var(--grey)", fontSize: "0.85rem" }}>24h Change</p>
          <p style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            color: coin.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"
          }}>
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
        <div>
          <p style={{ color: "var(--grey)", fontSize: "0.85rem" }}>Market Cap</p>
          <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            ${(coin.market_cap / 1e9)?.toFixed(2)}B
          </p>
        </div>
      </div>
    )}
  </div>
);

const ErrorMessage = ({ message, onRetry }) => {
  const isRateLimit = message.includes("Rate limit");
  const isNetwork = message.includes("Unable to connect") || message.includes("CORS");
  const isCORS = message.includes("CORS");

  return (
    <div style={{
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "12px",
      padding: "2rem",
      margin: "2rem auto",
      textAlign: "center",
      maxWidth: "700px"
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        {isRateLimit ? "⏱️" : isNetwork ? "🌐" : "⚠️"}
      </div>
      <h3 style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "1.25rem" }}>
        {isRateLimit ? "Rate Limit Reached" : isCORS ? "Connection Blocked (CORS)" : "Connection Error"}
      </h3>
      <p style={{ color: "var(--grey)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
        {message}
      </p>

      {isCORS && (
        <div style={{
          background: "rgba(255, 193, 7, 0.1)",
          border: "1px solid rgba(255, 193, 7, 0.3)",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          textAlign: "left"
        }}>
          <h4 style={{ color: "#ffc107", marginBottom: "1rem", fontSize: "1rem" }}>
            🔧 Quick Fix for CORS Issues:
          </h4>
          <ol style={{ color: "var(--grey)", lineHeight: "2", paddingLeft: "1.5rem", margin: 0 }}>
            <li>Open browser console (F12) and find the file with this code</li>
            <li>Change line ~23 to: <code style={{
              background: "rgba(0, 0, 0, 0.5)",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              color: "#4ade80"
            }}>useCorsProxy: true</code></li>
            <li>Save and refresh the page</li>
            <li>Or use the "Demo with Sample Data" button below</li>
          </ol>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={onRetry}
          style={{
            padding: "0.75rem 2rem",
            background: "var(--blue)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.target.style.background = "#4a5dd8"}
          onMouseOut={(e) => e.target.style.background = "var(--blue)"}
        >
          Try Again
        </button>

        <button
          onClick={() => {
            // Load demo data
            window.location.href = window.location.pathname + "?demo=true";
          }}
          style={{
            padding: "0.75rem 2rem",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.15)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
        >
          View Demo Data
        </button>
      </div>

      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        fontSize: "0.85rem",
        color: "var(--grey)",
        textAlign: "left"
      }}>
        <strong>Common Solutions:</strong>
        <ul style={{
          marginTop: "0.5rem",
          paddingLeft: "1.5rem",
          lineHeight: "1.8"
        }}>
          <li>Enable CORS proxy by editing the API_CONFIG (line 23)</li>
          <li>Try a different browser (Chrome, Firefox, Edge)</li>
          <li>Disable ad-blockers or browser extensions temporarily</li>
          <li>Check your internet connection</li>
          <li>Clear browser cache and cookies</li>
          <li>For production: Set up a backend proxy server</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================
// API Configuration & Caching
// ============================================

// CORS Proxy options - uncomment one if you're getting CORS errors
const API_CONFIG = {
  // Option 1: Direct API (may have CORS issues in some environments)
  baseUrl: 'https://api.coingecko.com/api/v3',

  // Option 2: Use CORS proxy (uncomment if direct API fails)
  // baseUrl: 'https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3',

  // Option 3: Use allOrigins proxy (most reliable)
  // This wraps the response in JSON, so we need to parse it differently
  useCorsProxy: false, // Set to true to enable
  corsProxyUrl: 'https://api.allorigins.win/raw?url=',
};

// Helper to build API URL
const buildApiUrl = (endpoint) => {
  if (API_CONFIG.useCorsProxy) {
    return `${API_CONFIG.corsProxyUrl}${encodeURIComponent(`https://api.coingecko.com/api/v3${endpoint}`)}`;
  }
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Simple in-memory cache to reduce API calls
const cache = {
  data: {},
  set: function (key, value, ttl = 300000) { // 5 minutes default TTL
    this.data[key] = {
      value,
      expiry: Date.now() + ttl
    };
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
  clear: function () {
    this.data = {};
  }
};

// Request queue to manage API calls
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

    // Wait before processing next request
    await new Promise(r => setTimeout(r, this.delayMs));
    this.processing = false;

    // Process next item in queue
    if (this.queue.length > 0) {
      this.process();
    }
  }
}

const requestQueue = new RequestQueue(1200); // 1.2 seconds between requests

// ============================================
// Utility Functions with Caching
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

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('📦 Using cached coin data');
    return cached;
  }

  // Add to request queue to prevent rate limiting
  return requestQueue.add(async () => {
    try {
      console.log('🌐 Fetching coin data from API');

      const url = buildApiUrl(`/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}. The service might be temporarily unavailable.`);
      }

      const data = await response.json();

      // Cache the result for 5 minutes
      cache.set(cacheKey, data, 300000);

      return data;
    } catch (error) {
      console.error("Error fetching coin data:", error);

      // Provide specific error messages
      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("Unable to connect to CoinGecko API. This might be a CORS issue. Try: 1) Using a different browser, 2) Disabling browser extensions, or 3) Contacting support.");
      }

      throw error;
    }
  });
};

const getCoinPrices = async (id, days, priceType) => {
  const cacheKey = `prices_${id}_${days}_${priceType}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('📦 Using cached price data');
    return cached;
  }

  // Add to request queue
  return requestQueue.add(async () => {
    try {
      console.log('🌐 Fetching price data from API');

      const url = buildApiUrl(`/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}. The service might be temporarily unavailable.`);
      }

      const data = await response.json();
      const prices = data[priceType];

      // Cache for 2 minutes (shorter since prices change frequently)
      cache.set(cacheKey, prices, 120000);

      return prices;
    } catch (error) {
      console.error("Error fetching coin prices:", error);

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("Unable to connect to CoinGecko API. This might be a CORS issue. Try: 1) Using a different browser, 2) Disabling browser extensions, or 3) Contacting support.");
      }

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
    datasets: [
      {
        label: coinData.name,
        data: prices.map((item) => item[1]),
        borderColor: "var(--blue)",
        backgroundColor: "rgba(88, 101, 242, 0.1)",
        tension: 0.25,
        fill: true,
      },
    ],
  });
};

// ============================================
// Main Component
// ============================================

function CoinPage() {
  // IMPORTANT: Uncomment this line to use with React Router
  // const { id } = useParams();

  // For standalone testing, you can hardcode an ID:
  // const id = "bitcoin"; // or "ethereum", "solana", etc.

  // For production, use this approach to get ID from URL:
  const getIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    // Assumes URL format like: /coin/bitcoin or /coin/ethereum
    const coinId = pathParts[pathParts.length - 1];
    return coinId || "bitcoin"; // Default to bitcoin if no ID found
  };

  const id = getIdFromUrl();

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(120);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const debounceTimeout = useRef(null);
  const abortController = useRef(null);

  // Initial data fetch - triggers whenever ID changes
  useEffect(() => {
    if (id) {
      // Reset states when coin changes
      setCoin(null);
      setChartData({ labels: [], datasets: [] });
      getData();
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [id]);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch coin data (will use cache if available)
      const data = await getCoinData(id);
      if (data) {
        coinObject(setCoin, data);

        // Fetch prices (will use cache if available)
        const prices = await getCoinPrices(id, days, priceType);
        if (prices) {
          settingChartData(setChartData, prices, data);
        }
      }
    } catch (err) {
      console.error("Error in getData:", err);
      setError(err.message || "Failed to load coin data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced price fetch with abort controller
  const fetchDebouncedPrices = useCallback((newDays, newPriceType) => {
    setChartLoading(true);

    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Abort previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    // Set new timeout with longer delay to avoid rate limiting
    debounceTimeout.current = setTimeout(async () => {
      try {
        const prices = await getCoinPrices(id, newDays, newPriceType);
        if (prices && coin) {
          settingChartData(setChartData, prices, coin);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching prices:", err);
          // Show a toast or subtle error indicator instead of full error
          setError(err.message);
        }
      } finally {
        setChartLoading(false);
      }
    }, 800); // Increased delay to 800ms
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

  const handleRetry = () => {
    getData();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Header />

      {error ? (
  <ErrorMessage message={error} onRetry={handleRetry} />
) : loading ? (
  <Loader />
) : coin ? (
  <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
    {/* Coin List */}
    <div className="grey-wrapper fade-in">
      <List coin={coin} delay={0.1} />
    </div>

    {/* Chart & Controls */}
    <div className="grey-wrapper fade-in" style={{ animationDelay: "0.2s" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1.5rem"
      }}>
        <SelectDays
          days={days}
          handleDaysChange={handleDaysChange}
          disabled={chartLoading}
        />
        <PriceToggle
          handlePriceTypeChange={handlePriceTypeChange}
          priceType={priceType}
          disabled={chartLoading}
        />
      </div>
      <LineChart
        chartData={chartData}
        priceType={priceType}
        isLoading={chartLoading}
      />
    </div>

    {/* Coin Description */}
    <CoinInfo name={coin.name} desc={coin.desc} />
  </div>
) : (
  <div style={{ textAlign: "center", padding: "4rem", color: "var(--grey)" }}>
    No coin data available
  </div>
)}


      <Footer />
    </div>
  );
}

export default CoinPage;