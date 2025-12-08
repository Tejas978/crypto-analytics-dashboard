import React, { useState } from "react";
import { Menu, X, Home, GitCompare, Star, LayoutDashboard, Sun, Moon } from "lucide-react";

export default function MobileDrawer({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", newMode ? "dark" : "light");
  };

  const navigationItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Compare", href: "/compare", icon: GitCompare },
    { label: "Watchlist", href: "/watchlist", icon: Star },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const theme = {
    drawerBg: darkMode ? "#080c14" : "#ffffff",
    text: darkMode ? "#e5e7eb" : "#1f2937",
    textSecondary: darkMode ? "#9ca3af" : "#6b7280",
    border: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    hoverBg: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    iconBg: darkMode ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.08)",
    accent: "#3b82f6",
    toggleBg: darkMode ? "#3b82f6" : "#cbd5e1",
    toggleDot: "#ffffff",
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          transition: "background-color 0.2s ease",
          color: theme.text,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-320px",
          width: "300px",
          height: "100vh",
          backgroundColor: theme.drawerBg,
          boxShadow: darkMode
            ? "-4px 0 32px rgba(0, 0, 0, 0.8)"
            : "-4px 0 32px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 20px",
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              ₿
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              CryptoVision
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              transition: "background-color 0.2s ease",
              color: theme.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isDashboard = item.label === "Dashboard";
            return (
              <a
                key={index}
                href={item.href}
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 20px",
                  margin: isDashboard ? "8px 16px" : "0",
                  textDecoration: "none",
                  color: isDashboard ? "#fff" : theme.text,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  borderLeft: isDashboard ? "none" : "3px solid transparent",
                  borderRadius: isDashboard ? "10px" : "0",
                  background: isDashboard ? "linear-gradient(135deg, #3b82f6, #1e40af)" : "transparent",
                  fontWeight: isDashboard ? 600 : 500,
                  boxShadow: isDashboard ? "0 2px 10px rgba(59,130,246,0.25)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isDashboard) {
                    e.currentTarget.style.backgroundColor = theme.hoverBg;
                    e.currentTarget.style.borderLeftColor = theme.accent;
                  } else {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDashboard) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderLeftColor = "transparent";
                  } else {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(59,130,246,0.25)";
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: isDashboard ? "rgba(255,255,255,0.15)" : theme.iconBg,
                  }}
                >
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: "15px" }}>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: theme.border,
            margin: "0 16px",
          }}
        />

        {/* Theme Toggle Section */}
        <div
          style={{
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: theme.iconBg,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "rgba(59,130,246,0.15)" : "rgba(251,191,36,0.15)",
                }}
              >
                {darkMode ? (
                  <Moon size={18} color={theme.accent} />
                ) : (
                  <Sun size={18} color="#f59e0b" />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: theme.text,
                    lineHeight: "1.2",
                  }}
                >
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    marginTop: "2px",
                  }}
                >
                  {darkMode ? "Easy on eyes" : "Bright & clear"}
                </div>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                position: "relative",
                width: "52px",
                height: "28px",
                backgroundColor: theme.toggleBg,
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: darkMode ? "27px" : "3px",
                  width: "22px",
                  height: "22px",
                  backgroundColor: theme.toggleDot,
                  borderRadius: "50%",
                  transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}