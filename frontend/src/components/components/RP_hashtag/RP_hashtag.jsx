/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const RP_hashtag = ({
  className,
  divClassName,
  text = "#Generative Models",
}) => {
  return (
    <div className={`frame ${className}`}>
      <div className={`generative-models ${divClassName}`}>{text}</div>
    </div>
  );
};

RP_hashtag.propTypes = {
  text: PropTypes.string,
};
