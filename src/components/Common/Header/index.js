import React, { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Home,
  GitCompare,
  Star,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

function Header() {
  // ✅ Default is ALWAYS DARK (initial load)
  const [darkMode, setDarkMode] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ----------------------------------------------------------
  // INITIALIZE THEME ON FIRST LOAD
  // ----------------------------------------------------------
  useEffect(() => {
    // Always start with dark mode
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----------------------------------------------------------
  // THEME TOGGLE FUNCTION
  // ----------------------------------------------------------
  const changeMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  // ----------------------------------------------------------
  // THEME COLORS
  // ----------------------------------------------------------
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

    navHoverBg: darkMode ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.10)",
    navHoverText: "#3b82f6",

    btnBg: "linear-gradient(135deg, #3b82f6, #1e40af)",
    btnShadow: "0 2px 10px rgba(59,130,246,0.25)",
    btnHoverShadow: "0 4px 14px rgba(59,130,246,0.35)",

    toggleBg: darkMode ? "rgba(25,35,55,0.5)" : "rgba(229,236,255,0.6)",
    toggleBorder: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
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
                  fontWeight: 700,
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
                CryptoTracker
              </span>
            </h1>
          </a>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div className="desktop-nav" style={{ display: "flex", gap: "1rem" }}>
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

              {/* BUTTON */}
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

              {/* THEME SWITCH */}
              <button
                onClick={changeMode}
                style={{
                  padding: ".6rem",
                  background: theme.toggleBg,
                  border: `1px solid ${theme.toggleBorder}`,
                  borderRadius: "10px",
                  color: theme.text,
                }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                padding: ".6rem",
                background: theme.toggleBg,
                border: `1px solid ${theme.toggleBorder}`,
                borderRadius: "10px",
                color: theme.text,
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      <style>{`
        * {
          transition: background-color .25s, color .25s, border-color .25s;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default Header;
