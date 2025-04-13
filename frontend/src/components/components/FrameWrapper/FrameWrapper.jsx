//옆에 하트랑 욜로 부분

import PropTypes from "prop-types";
import React from "react";
import { RP_hashtag } from "../RP_hashtag";
import "./style.css";

export const FrameWrapper = ({
  className,
  vector = "/img/vector-6.svg",
  youOnlyLookOnceClassName,
}) => {
  return (
    <div className={`frame-wrapper ${className}`}>
      <img className="image-5" alt="Image" src="/img/image-62.png" />

      <div className="frame-14">
        <div className="frame-15">
          <p className={`you-only-look-once ${youOnlyLookOnceClassName}`}>
            You Only Look Once:
            <br />
            Unifed, Real-Time Object Detection
          </p>

          <div className="text-wrapper-25">CVPR / 2016</div>
        </div>

        <div className="frame-16">
          <div className="group-11">
            <div className="text-wrapper-26">1131</div>

            <img className="vector-13" alt="Vector" src={vector} />
          </div>

          <div className="group-12">
            <div className="text-wrapper-27">1131</div>

            <img
              className="group-13"
              alt="Group"
              src="/img/group-1686557930-1.png"
            />
          </div>

          <RP_hashtag
            className="frame-17"
            divClassName="frame-18"
            text="#Detection"
          />
          <RP_hashtag className="frame-17" divClassName="frame-18" text="#YOLO" />
        </div>
      </div>
    </div>
  );
};

FrameWrapper.propTypes = {
  vector: PropTypes.string,
};
