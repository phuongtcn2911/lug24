import "./CheckBox.css";

export default function Checkbox({ children, isChecked, onChange, disabled }) {

  const handleClick = () => {
    if (disabled) return;
    if (onChange) onChange(!isChecked);
  };

  return (
    <div className={`custom-checkbox-item ${disabled ? "disabled" : ""}`}
      onClick={handleClick}>
      <div
        className={`custom-checkbox-box 
          ${isChecked ? "checked" : ""} 
          ${disabled ? "disabled" : ""}`}
      ></div>
      <span className={`custom-checkbox-label ${disabled ? "disabled" : ""}`}>
        {children}
      </span>
    </div>
  );
}