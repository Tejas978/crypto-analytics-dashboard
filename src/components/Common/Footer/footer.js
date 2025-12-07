import React from "react";
import { Facebook, Mail, Twitter, Instagram, ArrowUp, Github, Linkedin } from "lucide-react";

function Footer() {
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook", color: "#1877f2" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter", color: "#1da1f2" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram", color: "#e4405f" },
    { href: "https://github.com", icon: Github, label: "GitHub", color: "#333" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", color: "#0077b5" },
    { href: "mailto:avivashishta@gmail.com", icon: Mail, label: "Email", color: "#ea4335" },
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/compare", label: "Compare" },
    { href: "/watchlist", label: "Watchlist" },
  ];

  return (
    <div className="footer" style={{
      position: "relative",
      borderTop: "1px solid rgba(59, 130, 246, 0.2)"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "3rem 2rem 1.5rem"
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {/* Brand Section */}
          <div>
            <h2 
              className="logo" 
              onClick={topFunction}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, var(--blue) 0%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                transition: "transform 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <span style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, var(--blue) 0%, #1e3a8a 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                color: "white"
              }}>₿</span>
              CryptoVision<span style={{ color: "var(--blue)" }}>.</span>
            </h2>
            <p style={{
              color: "var(--grey)",
              fontSize: "0.9rem",
              lineHeight: "1.6",
              margin: "0"
            }}>
              Track cryptocurrency prices, compare coins, and manage your watchlist all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              color: "var(--white)",
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "1rem"
            }}>Quick Links</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "var(--grey)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.3s",
                    width: "fit-content"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "var(--blue)";
                    e.currentTarget.style.paddingLeft = "0.5rem";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "var(--grey)";
                    e.currentTarget.style.paddingLeft = "0";
                  }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 style={{
              color: "var(--white)",
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "1rem"
            }}>Connect With Us</h3>
            <div className="social-links" style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap"
            }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "42px",
                    background: "rgba(30, 58, 138, 0.3)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "var(--white)",
                    textDecoration: "none",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 4px 12px ${social.color}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(30, 58, 138, 0.3)";
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}>
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(59, 130, 246, 0.2)",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p style={{
            color: "var(--grey)",
            fontSize: "0.875rem",
            margin: 0
          }}>
            © {new Date().getFullYear()} CryptoVision. All rights reserved.
          </p>
          
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="/privacy" style={{
              color: "var(--grey)",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "color 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "var(--blue)"}
            onMouseOut={(e) => e.currentTarget.style.color = "var(--grey)"}>
              Privacy Policy
            </a>
            <a href="/terms" style={{
              color: "var(--grey)",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "color 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "var(--blue)"}
            onMouseOut={(e) => e.currentTarget.style.color = "var(--grey)"}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={topFunction}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "50px",
          height: "50px",
          background: "linear-gradient(135deg, var(--blue) 0%, #1e3a8a 100%)",
          border: "none",
          borderRadius: "50%",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
          transition: "all 0.3s",
          zIndex: 100
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.5)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
        }}
        aria-label="Scroll to top">
        <ArrowUp size={24} />
      </button>

      <style>{`
        @media only screen and (max-width: 768px) {
          .footer > div {
            padding: 2rem 1.5rem 1rem !important;
          }
          .footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
          .footer > div > div:last-child {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Footer;