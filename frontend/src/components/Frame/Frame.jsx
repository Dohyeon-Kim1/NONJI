import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Frame = ({ className = "", placeholder, type = "text", value, onChange }) => {
  return (
    <div className={`frame ${className}`}>
      <input
        className="input-field"
        type={type}
        placeholder={placeholder}   // ✅ 여기 중요
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

Frame.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};