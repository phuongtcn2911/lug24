import "./Checkbox.css";

export default function Checkbox({ children, isChecked, onChange }) {


  const handleClick = () => {
    if (onChange) onChange(!isChecked);
  };

  return (
    <div className="custom-checkbox-item" onClick={handleClick}>
      <div className={`custom-checkbox-box ${isChecked ? "checked" : ""}`} ></div>
      <span className="custom-checkbox-label">{children}</span>
    </div>
  );
}