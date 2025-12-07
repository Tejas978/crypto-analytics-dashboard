import { MenuItem, Select } from "@mui/material";
import React from "react";
import "./styles.css"; // UPGRADE: Importing new CSS file

/**
 * UPGRADED SelectDays Component
 * - Styles moved to a professional, themed CSS file.
 * - Layout uses flexbox.
 */
function SelectDays({ days, handleDaysChange, noText }) {
  return (
    // UPGRADE: Added "select-days-flex" for proper layout
    <div className="select-days-flex">
      {!noText && <p>Days</p>}
      <Select
        value={days}
        onChange={handleDaysChange}
        // UPGRADE: All styles are now in CSS
        className="select-days"
      >
        <MenuItem value={7}>7 Days</MenuItem>
        <MenuItem value={30}>30 Days</MenuItem>
        <MenuItem value={60}>60 Days</MenuItem>
        <MenuItem value={90}>90 Days</MenuItem>
        <MenuItem value={120}>120 Days</MenuItem>
      </Select>
    </div>
  );
}

export default SelectDays;