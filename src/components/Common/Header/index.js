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
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") setDark();
    else setLight();

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeMode = () => {
    setDarkMode(!darkMode);
    const mode = localStorage.getItem("theme");
    mode === "dark" ? setLight() : setDark();
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  // 🔥 Modern Blue Theme
  const theme = {
    bg: darkMode
      ? scrolled
        ? "rgba(8, 12, 20, 0.85)"
        : "rgba(8, 12, 20, 0.95)"
      : scrolled
        ? "rgba(255, 255, 255, 0.85)"
        : "rgba(255, 255, 255, 0.95)",

    border: darkMode
      ? "rgba(255, 255, 255, 0.07)"
      : "rgba(0, 0, 0, 0.07)",

    text: darkMode ? "#e5e7eb" : "#1f2937",
    textMuted: darkMode ? "#9ca3af" : "#6b7280",

    // BLUE REPLACEMENT (previously violet)
    logoGradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    logoBg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    logoIcon: "#fff",

    navHoverBg: darkMode ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.10)",
    navHoverText: "#3b82f6",

    // Buttons blue gradient
    btnBg: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    btnShadow: "0 2px 10px rgba(59, 130, 246, 0.25)",
    btnHoverShadow: "0 4px 14px rgba(59, 130, 246, 0.35)",

    toggleBg: darkMode ? "rgba(25, 35, 55, 0.5)" : "rgba(229, 236, 255, 0.6)",
    toggleBorder: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",

    mobileBg: darkMode ? "rgba(8, 12, 20, 0.98)" : "rgba(255, 255, 255, 0.98)",
    mobileItemBg: darkMode ? "rgba(25, 35, 55, 0.3)" : "rgba(235, 240, 255, 0.6)",
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
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: 700,
                  fontSize: "1.38rem",
                }}
              >
                CryptoVision
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = theme.navHoverBg;
                    e.currentTarget.style.color = theme.navHoverText;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = theme.text;
                  }}
                >
                  <link.icon size={18} />
                  {link.label}
                </a>
              ))}

              {/* BLUE MODERN BUTTON */}
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = theme.btnHoverShadow;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = theme.btnShadow;
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

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu"
            style={{
              background: theme.mobileBg,
              borderTop: `1px solid ${theme.border}`,
              padding: "1rem",
              animation: "slideDown .3s ease",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "1rem",
                  display: "flex",
                  gap: ".75rem",
                  color: theme.text,
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                <link.icon size={20} />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

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
