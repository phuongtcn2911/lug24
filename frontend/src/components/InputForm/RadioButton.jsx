import React from "react";
import "./RadioButton.css";

export default function RadioButton({ label, value, groupName, selectedValue, onChange }) {
  const isSelected = selectedValue[groupName] === value;

  return (
    <div className="custom-radio-group">
      <div
        className="custom-radio-item"
        onClick={() => onChange(groupName,value)}
      >
        <div className={`custom-radio-circle ${isSelected ? "selected" : ""}`}></div>
       
        <span className="custom-radio-label">{label}</span>
      </div>
    </div>
  );
}