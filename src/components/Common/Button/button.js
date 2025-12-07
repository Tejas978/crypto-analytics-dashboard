import React from "react";
import "./styles.css";

/**
 * UPGRADED Button Component
 * - Professional, modern, and futuristic style.
 * - Handles 'outlined' prop for two button types.
 */
function Button({ text, onClick, outlined, disabled }) {
  return (
    <button
      className={outlined ? "btn-outlined" : "btn-filled"}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;