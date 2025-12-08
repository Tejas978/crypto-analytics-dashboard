// Header.js
import React, { useEffect, useState } from "react";
import MobileDrawer from "./Drawer.js";
import {
  Moon,
  Sun,
  Home,
  GitCompare,
  Star,
  LayoutDashboard,
} from "lucide-react";

function Header() {
  // Single dark mode state shared between desktop and mobile
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [darkMode]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
  };

  const theme = {
    bg: darkMode
      ? scrolled
        ? "rgba(8, 12, 20, 0.85)"
        : "rgba(8, 12, 20, 0.95)"
      : scrolled
        ? "rgba(255, 255, 255, 0.85)"
        : "rgba(255, 255, 255, 0.95)",
    border: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    text: darkMode ? "#e5e7eb" : "#1f2937",
    logoGradient: "linear-gradient(135deg, #3b82f6, #1e40af)",
    logoBg: "linear-gradient(135deg, #1e3a8a, #1e40af)",
    logoIcon: "#fff",
    btnBg: "linear-gradient(135deg, #3b82f6, #1e40af)",
    btnShadow: "0 2px 10px rgba(59,130,246,0.25)",
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/compare", label: "Compare", icon: GitCompare },
    { href: "/watchlist", label: "Watchlist", icon: Star },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: theme.bg,
          backdropFilter: "blur(18px)",
          borderBottom: `1px solid ${theme.border}`,
          transition: "all .25s ease",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.8rem 2rem",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* LOGO */}
          <a href="/" style={{ textDecoration: "none" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
              }}
            >
              <span
                style={{
                  width: "38px",
                  height: "38px",
                  background: theme.logoBg,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.logoIcon,
                }}
              >
                ₿
              </span>
              <span
                style={{
                  background: theme.logoGradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: 700,
                  fontSize: "1.38rem",
                }}
              >
                CryptoVision
              </span>
            </h1>
          </a>

          {/* DESKTOP NAV */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  padding: ".6rem 1rem",
                  borderRadius: "10px",
                  color: theme.text,
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontWeight: 500,
                  transition: "all .2s",
                }}
              >
                <link.icon size={18} />
                {link.label}
              </a>
            ))}

            {/* DASHBOARD BUTTON */}
            <a href="/dashboard" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: ".6rem 1.25rem",
                  background: theme.btnBg,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: ".95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  cursor: "pointer",
                  boxShadow: theme.btnShadow,
                  transition: "all .2s",
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
            </a>

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              style={{
                padding: ".6rem",
                background: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: theme.text,
              }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* MOBILE DRAWER */}
          <div className="mobile-nav">
            <MobileDrawer darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </nav>
      </header>

      <style>{`
        * { transition: background-color .25s, color .25s, border-color .25s; }
        @media (max-width: 768px) { 
          .desktop-nav { display: none !important; } 
          .mobile-nav { display: block !important; } 
        }
        @media (min-width: 769px) { 
          .mobile-nav { display: none !important; } 
        }
      `}</style>
    </>
  );
}

export default Header;
