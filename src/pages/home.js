import React, { useState, useEffect } from "react";
import Footer from "../components/Common/Footer/footer";
import Header from "../components/Common/Header";
import LandingPageComponent from "../components/LandingPage/Intro";

function HomePage() {
  // 1. Initialize state from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      // Default to true (dark) if no theme is saved or if it's 'dark'
      return savedTheme === "dark" || savedTheme === null;
    }
    return true;
  });

  // 2. Define the toggle function
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 3. Sync state changes to localStorage and DOM
  useEffect(() => {
    const themeValue = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", themeValue);
    document.documentElement.setAttribute("data-theme", themeValue);
  }, [isDarkMode]);

  // 4. CRITICAL FIX: Listen for external theme changes
  // If your Header/Drawer updates the DOM directly (bypassing props), this catches it.
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          const newTheme = document.documentElement.getAttribute("data-theme");
          const isDark = newTheme === "dark";
          // Sync state if it differs from DOM
          setIsDarkMode((prev) => (prev !== isDark ? isDark : prev));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Pass state and toggle function to Header */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Pass the isDarkMode prop to LandingPage */}
      <LandingPageComponent isDarkMode={isDarkMode} />

      <Footer />
    </div>
  );
}

export default HomePage;