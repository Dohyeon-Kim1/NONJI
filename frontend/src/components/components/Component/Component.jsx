/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component = ({
  className,
  overlapGroupClassName,
  groupClassName,
  imageClassName,
  image = "/img/image-63.png",
  frameClassName,
  vector = "/img/vector-5.svg",
  divClassName,
  frameClassNameOverride,
  group = "/img/group-1686557930.png",
  divClassNameOverride,
  ellipse = "/img/ellipse-1698.svg",
  text = "1",
  divClassName1,
}) => {
  return (
    <div className={`component ${className}`}>
      <div className={`overlap-group-4 ${overlapGroupClassName}`}>
        <div className={`group-15 ${groupClassName}`}>
          <div className="text-wrapper-29">Vaswani et al.</div>

          <img
            className={`image-6 ${imageClassName}`}
            alt="Image"
            src={image}
          />

          <div className={`frame-19 ${frameClassName}`}>
            <img className="vector-14" alt="Vector" src={vector} />

            <div className={`text-wrapper-30 ${divClassName}`}>1325</div>
          </div>

          <div className={`frame-20 ${frameClassNameOverride}`}>
            <img className="group-16" alt="Group" src={group} />

            <div className={`text-wrapper-31 ${divClassNameOverride}`}>
              13.2k
            </div>
          </div>

          <img className="ellipse-4" alt="Ellipse" src={ellipse} />
        </div>

        <div className={`element ${divClassName1}`}>{text}</div>
      </div>

      <p className="text-wrapper-32">Attention Is All You Need</p>
    </div>
  );
};

Component.propTypes = {
  image: PropTypes.string,
  vector: PropTypes.string,
  group: PropTypes.string,
  ellipse: PropTypes.string,
  text: PropTypes.string,
};
