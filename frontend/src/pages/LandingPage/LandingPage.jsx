import React, { useState } from "react"; // ✅ useState 추가
import { Component } from "../../components/components/Component";
import { RP_hashtag } from "../../components/components/RP_hashtag";
import { Frame1 } from "../../components/components/Frame1";
import { FrameWrapper } from "../../components/components/FrameWrapper";
import { Group } from "./sections/RecentPaper1";
import { OverlapWrapper } from "./sections/bottom";
import { MakeAPostPopup } from "../../components/popup/MakeAPostPopup";
import "./style.css";

const data = [
  {
    title: "ddd",
    name: "ddd",
    content: "ddd",
  },
  {
    title: "ddd",
    name: "ddd",
    content: "ddd",
  },
  {
    title: "ddd",
    name: "ddd",
    content: "ddd",
  }
]

export const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태
  return (
    <div className="landing-page">
            {/* 팝업 뒤 배경 어둡게 */}
            {showPopup && <div className="popup-overlay" onClick={() => setShowPopup(false)} />}
            {/* 팝업 본체 */}
            {showPopup && <MakeAPostPopup onClose={() => setShowPopup(false)} />}
      <div className="div-4">
        <div className="overlap-5">
          <div className="text-wrapper-33">My keywords</div>

          <div className="text-wrapper-34">Saved Projects / Interest</div>

          <div className="overlap-6">
            <div className="text-wrapper-35">AI developer</div>

            <img
              className="ellipse-5"
              alt="Ellipse"
              src="/img/ellipse-1697.svg"
            />

            <div className="text-wrapper-36">Taeyoon Kim</div>

            <img className="vector-15" alt="Vector" src="/img/vector-8.svg" />
          </div>

          <div className="frame-21">
            <RP_hashtag className="frame-22" text="#Generative Models" />
            <RP_hashtag className="frame-22" text="#Stable Diffusion" />
            <RP_hashtag className="frame-22" text="#OpenAI" />
            <RP_hashtag className="frame-22" text="#Multimodal Learning" />
            <RP_hashtag className="frame-22" text="#Machine Learning" />
            <RP_hashtag className="frame-22" text="#Deeplearning" />
          </div>

          <div className="group-17">
            <div className="text-wrapper-37">8</div>

            <img className="vector-16" alt="Vector" src="/img/vector-7.svg" />
          </div>

          <img className="vector-17" alt="Vector" src="/img/vector-9.svg" />

          <FrameWrapper
            className="frame-17-instance"
            vector="/img/vector-14.svg"
          />
          <FrameWrapper
            className="frame-24"
            vector="/img/vector-14.svg"
            youOnlyLookOnceClassName="frame-23"
          />
          <FrameWrapper className="frame-25" vector="/img/vector-14.svg" />
          <FrameWrapper className="frame-26" vector="/img/vector-14.svg" />
          <FrameWrapper className="frame-27" vector="/img/vector-14.svg" />
          <img className="line" alt="Line" src="/img/line-3.svg" />

          <img className="line-2" alt="Line" src="/img/line-3.svg" />
        </div>

        <div className="overlap-7">
          <div className="text-wrapper-38">Recent Paper</div>

          <img className="line-3" alt="Line" src="/img/line-4.svg" />

          <div className="overlap-8">
          {data.map((item, index) => {
  return (
    <Group
      key={index}
      title={item.title}
      content={item.content}
      name={item.name}
    />
  );
})}
            
          </div>
          
          <img
            className="group-18"
            alt="Group"
            src="/img/group-1686557953.png"
          />
        </div>

        <div className="overlap-9">
          <div className="text-wrapper-39">Popular Paper</div>

          <img className="line-4" alt="Line" src="/img/line-4.svg" />

          <Component className="component-1" />
          <Component
            className="component-6"
            divClassName="component-3"
            divClassNameOverride="component-5"
            ellipse="/img/ellipse-1698-2.svg"
            frameClassName="component-2"
            frameClassNameOverride="component-4"
            group="/img/group-1686557930-8.png"
            groupClassName="component-instance"
            image="/img/image-63-2.png"
            imageClassName="component-1-instance"
            overlapGroupClassName="component-instance"
            text="2"
            vector="/img/vector-16.svg"
          />
          <Component
            className="component-8"
            divClassName1="component-7"
            ellipse="/img/ellipse-1698-3.svg"
            group="/img/group-1686557930.png"
            image="/img/image-63.png"
            text="3"
            vector="/img/vector-5.svg"
          />
          <img className="vector-18" alt="Vector" src="/img/vector-18.svg" />

          <img className="vector-19" alt="Vector" src="/img/vector-19.svg" />

          <img
            className="group-19"
            alt="Group"
            src="/img/group-1686557954.png"
          />

          <RP_hashtag className="frame-28" divClassName="frame-29" text="Daily" />
          <RP_hashtag className="frame-30" divClassName="frame-29" text="Weekly" />
          <RP_hashtag className="frame-31" divClassName="frame-29" text="Monthly" />
        </div>

        <div className="overlap-10">
          <div className="logo">
            <div className="overlap-11">
              <div className="text-wrapper-40">N</div>

              <div className="text-wrapper-41">N</div>

              <div className="overlap-group-wrapper">
                <div className="overlap-group-5">
                  <div className="ellipse-6" />

                  <img
                    className="vector-20"
                    alt="Vector"
                    src="/img/vector-146.svg"
                  />

                  <img
                    className="vector-21"
                    alt="Vector"
                    src="/img/vector-148.svg"
                  />

                  <img
                    className="vector-22"
                    alt="Vector"
                    src="/img/vector-147.svg"
                  />
                </div>
              </div>
            </div>

            <div className="vector-wrapper">
              <img
                className="vector-23"
                alt="Vector"
                src="/img/vector-145.svg"
              />
            </div>
          </div>

          <div className="overlap-12">
          <Frame1
  className="frame-1-instance"
  divClassName="frame-32"
  text="Search"
  onSearch={(query) => console.log("🔍 검색어:", query)}
/>
            <button className="search-wrapper">
              <img
                className="group-20"
                alt="Group"
                src="/img/search-icon.svg"
              />
            </button>
          </div>

          <div className="group-21">
            <img
              className="group-22"
              alt="Group"
              src="/img/group-1686557951.png"
            />

            <div className="text-wrapper-42">Profile</div>
          </div>

          <div className="group-23">
            <img
              className="group-24"
              alt="Group"
              src="/img/group-1686557944.png"
            />

            <div className="text-wrapper-43">Colab</div>
          </div>

          <div className="group-25">
            <img
              className="group-26"
              alt="Group"
              src="/img/group-1686557955.png"
            />

            <div className="text-wrapper-44">Setting</div>
          </div>

          <div className="group-27">
            <img
              className="group-28"
              alt="Group"
              src="/img/group-1686557956.png"
            />

            <div className="text-wrapper-45">Logout</div>
          </div>
        </div>

        <div className="overlap-13">
          <img className="line-5" alt="Line" src="/img/line-4.svg" />

          <img className="line-6" alt="Line" src="/img/line-6.svg" />
        </div>

        <div className="text-wrapper-46">Home</div>

        <div className="text-wrapper-47">Community</div>

        <OverlapWrapper />
        <div className="frame-33">
          <div className="frame-34">
            <div className="text-wrapper-48">Engineering &amp; Computing</div>

            <img
              className="genetic-engineering"
              alt="Genetic engineering"
              src="/img/genetic-engineering-2.png"
            />
          </div>

          <div className="frame-35">
            <div className="text-wrapper-48">Natural Sciences</div>

            <img
              className="environmental"
              alt="Environmental"
              src="/img/environmental-science-1.png"
            />
          </div>

          <div className="frame-36">
            <div className="text-wrapper-48">Life Sciences</div>

            <img
              className="genetical"
              alt="Genetical"
              src="/img/genetical-engineering-icon-in-line-style-1.png"
            />
          </div>

          <div className="frame-37">
            <div className="text-wrapper-48">Mathematics</div>

            <img
              className="math-operations"
              alt="Math operations"
              src="/img/math-operations-1.png"
            />
          </div>

          <div className="frame-38">
            <div className="text-wrapper-48">
              Social Sciences &amp; Humanities
            </div>

            <img
              className="human-brain"
              alt="Human brain"
              src="/img/human-brain-1.png"
            />
          </div>

          <div className="frame-39">
            <p className="text-wrapper-48">Design / Art / Media</p>

            <img className="art" alt="Art" src="/img/art-1.png" />
          </div>
        </div>
        <div className="group-1686557941" onClick={() => setShowPopup(true)}>
          <div className="text-wrapper-28">Make a Post</div>
          <img className="group-14" alt="Group" src="/img/group-1686557940.png" />
        </div>
      </div>
      
    </div>
  );
};
