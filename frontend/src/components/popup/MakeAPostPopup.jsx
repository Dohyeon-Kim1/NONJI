import React from "react";
import "./style.css"; // ✅ CSS 연결
import { useState } from "react";

export const MakeAPostPopup = ({ onClose }) => {
  const [selectedPaper, setSelectedPaper] = useState("my");
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="make-a-post-popup">
      <div className="div">
        {/* 이미지 업로드 영역 */}
        <div className="popup_overlap">
          <div className="text-wrapper-2">Select Image to Upload</div>
          <p className="p">Supported Format : SVG, PNG</p>

          <div className="popup_upload">
            <img className="popup_group-2" alt="Upload" src="/img/upload.svg" />
          </div>

          <div className="popup_overlap-group-wrapper">
            <div className="popup_overlap-group-2">
              <img className="img" alt="Select file" src="/img/select_file.svg" />
            </div>
          </div>
        </div>

        {/* 파일 미리보기 안내 */}
        <div className="popup_overlap-group">
          <p className="text-wrapper-3">your uploaded file will appear here</p>
        </div>

        {/* 콘텐츠 작성 영역 */}
        <div className="group-3">
          <div className="text-wrapper-4">Post Content</div>
          <TextareaFrame
            height="211px"
            placeholder='✨ "Share your insights, questions, or findings…"'
          />
        </div>

        {/* 제목 입력 영역 */}
        <div className="group-4">
          <div className="text-wrapper-4">Title</div>
          <InputFrame placeholder="Write your post title" />
        </div>

        {/* 해시태그 */}
        <div className="group-5">
          <div className="text-wrapper-4">Hashtags</div>
          <div className="password-wrapper">
            <InputFrame placeholder="ex) #Deep Learning, LLM... etc"/>
          </div>
        </div>

        {/* 파일 첨부 버튼 */}
        <Button className="component-5" />

        {/* 파일 링크 */}
        <div className="group-6">
          <div className="text-wrapper-4">File link</div>
          <div className="div-wrapper">
          <InputFrame placeholder="ex) https://arxiv.org/abs"/>
          </div>
        </div>

        {/* 옵션 선택 */}
        <div className="radio-group">
  <label className="radio-label ellipse">
    <input
      type="radio"
      name="paperType"
      value="my"
      checked={selectedPaper === "my"}
      onChange={() => setSelectedPaper("my")}
    />
    <span className="custom-radio" />
    My Paper
  </label>

  <label className="radio-label ellipse-2">
    <input
      type="radio"
      name="paperType"
      value="other"
      checked={selectedPaper === "other"}
      onChange={() => setSelectedPaper("other")}
    />
    <span className="custom-radio" />
    Someone Else’s Paper
  </label>
</div>

        <div className="group-9"><div className="text-wrapper-5">Make AI Shorts 🪄</div></div>

        {/* 선택 체크박스 */}
        <input type="checkbox" name="check" value={isChecked} onChange={() => setIsChecked(!isChecked)} className="rectangle" />

        {/* 닫기 버튼 */}
        <img
          className="group-11"
          alt="Close"
          src="/img/cross.svg"
          onClick={onClose} // ✅ 닫기 기능 연결
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

// ✅ 입력창
const InputFrame = ({ placeholder = "" }) => (
  <input
    type="text"
    className="frame-1-instance"
    placeholder={placeholder}
    style={{
      height: "70px",
      width: "656px",
      border: "1px solid #e6e8ea",
      borderRadius: "12px",
      padding: "20px",
      fontSize: "16px",
      color: "#000",
      backgroundColor: "#fafcfe"
    }}
  />
);

// ✅ 텍스트박스
const TextareaFrame = ({ placeholder = "", height = "211px" }) => (
  <textarea
    className="frame-1"
    placeholder={placeholder}
    style={{
      height,
      width: "656px",
      border: "1px solid #e6e8ea",
      borderRadius: "12px",
      padding: "20px",
      fontSize: "16px",
      color: "#000",
      backgroundColor: "#fafcfe",
      resize: "none"
    }}
  />
);

// ✅ 버튼
const Button = ({ className }) => (
  <button
    className={className}
    style={{
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#4a90e2",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer"
    }}
  >
    Attach File
  </button>
);