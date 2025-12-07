import React, { useState, useEffect } from "react";
import NorthRoundedIcon from "@mui/icons-material/NorthRounded";
import "./styles.css";

function TopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`top-btn ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      role="button"
      aria-label="Scroll to top"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          scrollToTop();
        }
      }}
    >
      <NorthRoundedIcon className="top-icon" sx={{ fontSize: "2rem" }} />
      <span className="tooltip">Back to Top</span>
    </div>
  );
}

export default TopButton;