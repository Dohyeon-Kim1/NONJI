

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Frame1 = ({ className = "", divClassName = "", text = "", onSearch }) => {
  const [query, setQuery] = React.useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className={`frame-1 ${className}`}>
      <input
        type="text"
        className={`frame_search ${divClassName}`}
        placeholder={text}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

Frame1.propTypes = {
  text: PropTypes.string,
  onSearch: PropTypes.func,
};