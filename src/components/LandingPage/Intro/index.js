import React, { useState, useEffect } from "react";
import iphoneImg from "../../../assets/iphone.png";
import {
  TrendingUp,
  Shield,
  BarChart3,
  Share2,
  Check,
  ArrowRight,
  ArrowUp
} from "lucide-react";

// Import the separate CSS file
// Note: This import works in a standard local environment (like CRA or Vite)
// but may not resolve in this live preview window.
import './styles.css';

// Image variable for the phone screen
// const iphoneImg = "https://placehold.co/280x560/1a1a1a/3b82f6?text=Crypto+App+Preview";

// Simple animation hook
function useInView() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return isVisible;
}

// Accepts isDarkMode as a prop from the parent
function LandingPageComponent({ isDarkMode = true }) {
  const isVisible = useInView();
  const [floatingOffset, setFloatingOffset] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingOffset(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareData = {
    text: "Check out this amazing Crypto Dashboard built with React JS - Track cryptocurrency prices in real-time!",
    url: "https://crypto-dashboard-dec.netlify.app/",
    title: "Crypto Dashboard - Real-Time Tracking"
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      // Fallback
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = shareData.url;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const features = [
    {
      icon: (
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600/30 via-blue-400/20 to-blue-600/10 
        text-blue-300 shadow-lg shadow-blue-500/30 backdrop-blur-md border border-blue-500/20">
          <BarChart3 size={20} />
        </div>
      ),
      text: "Real-time market data",
    },
    {
      icon: (
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/30 via-emerald-400/20 to-emerald-600/10
        text-emerald-300 shadow-lg shadow-emerald-500/30 backdrop-blur-md border border-emerald-500/20">
          <TrendingUp size={20} />
        </div>
      ),
      text: "Advanced analytics",
    },
    {
      icon: (
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600/30 via-purple-400/20 to-purple-600/10 
        text-purple-300 shadow-lg shadow-purple-500/30 backdrop-blur-md border border-purple-500/20">
          <Shield size={18} />
        </div>
      ),
      text: "Secure & Encrypted",
    },
  ];

  const stats = [
    { number: "500+", label: "Cryptocurrencies" },
    { number: "24/7", label: "Live Updates" },
    { number: "100K+", label: "Active Users" }
  ];

  return (
    <div className={`landing-root ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      
      <div className="landing-wrapper">

        {/* Left Content Section */}
        <section className={`content-section ${isVisible ? 'is-visible' : ''}`}>

          {/* Feature Pills */}
          <div className="feature-pills">
            {features.map((feature, index) => (
              <div key={index} className="pill" style={{ transitionDelay: `${index * 100}ms` }}>
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Main Heading */}
          <div>
            <h1 className="hero-title primary">Track Crypto</h1>
            <h1 className="hero-title accent">Real Time.</h1>
          </div>

          {/* Description */}
          <p className="hero-desc">
            Track cryptocurrency prices through a powerful public API in real-time.
            Monitor market trends, analyze performance, and stay ahead of the curve
            with our comprehensive dashboard.
          </p>

          {/* Stats Grid */}
          <div className="stats-row">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="cta-group">
            <a href="/dashboard" className="btn btn-primary">
              Launch Dashboard <ArrowRight size={18} />
            </a>

            <button onClick={handleShare} className="btn btn-outline">
              <Share2 size={18} />
              Share App
            </button>
          </div>
        </section>

        {/* Right Visual Section */}
        <aside className={`visual-section ${isVisible ? 'is-visible' : ''}`}>

          {/* Glowing Orb Background */}
          <div className="glow-orb" />

          {/* Phone Mockup */}
          <div className="phone-mockup float-lg">
            <div className="phone-frame">

              {/* Notch */}
              <div className="phone-notch">
                <div className="notch-camera" />
                <div className="notch-speaker" />
              </div>

              {/* Screen */}
              <div className="phone-screen">
                <img
                  src={iphoneImg}
                  alt="Crypto Dashboard Preview"
                  className="phone-image"
                  loading="lazy"
                />
              </div>

              {/* Buttons */}
              <div className="phone-button phone-button-power" />
              <div className="phone-button phone-button-volume-up" />
              <div className="phone-button phone-button-volume-down" />
            </div>
          </div>

          {/* Floating Bitcoin Card */}
          <div className="floating-card card-btc float-md">
            <div className="coin-icon" style={{ background: 'var(--bitcoin-gradient)' }}>
              ₿
            </div>
            <div className="coin-details">
              <span className="coin-name">Bitcoin</span>
              <span className="coin-price">$43,250</span>
              <span className="coin-trend"><TrendingUp size={12} /> +2.4%</span>
            </div>
          </div>

          {/* Floating Ethereum Card */}
          <div className="floating-card card-eth float-sm">
            <div className="coin-icon" style={{ background: 'var(--eth-gradient)' }}>
              Ξ
            </div>
            <div className="coin-details">
              <span className="coin-name">Ethereum</span>
              <span className="coin-price">$2,280</span>
              <span className="coin-trend"><TrendingUp size={12} /> +3.8%</span>
            </div>
          </div>
        </aside>

      </div>

      <button className="scroll-top" onClick={scrollToTop}>
        <ArrowUp size={24} />
      </button>

      {/* Copy Toast */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <Check size={18} color="#10b981" />
        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Link copied to clipboard!</span>
      </div>
    </div>
  );
}

export default LandingPageComponent;