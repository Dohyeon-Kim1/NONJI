import React, { useState } from "react";
import { Frame } from "../../components/Frame";
import "./style.css";
import { useNavigate } from "react-router-dom";

export const Screen = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "test@example.com" && pass === "1234") {
      alert("로그인 성공!");
      //navigate("/home");
      navigate("/LandingPage");
    } else {
      alert("이메일 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="container">
      <div className="div">
        {/* 헤더 이미지 및 문구 */}
        <div className="overlap-group">
          <div className="text-wrap_login">Where research resonates</div>
          <p className="p">Connect with minds that think like yours</p>
          <img
            className="humaaans-research"
            src="/img/humaaans-research-1-1.png"
            alt=""
            aria-hidden="true"
          />
        </div>

        {/* 로고 */}
        <img className="logo" src="/img/logo.svg" alt="Logo" />

        {/* 로그인 안내 텍스트 */}
        <p className="text-info-login1">Log in to your Account</p>
        <p className="text-info-login2">Welcome back! Select method to log in:</p>

        {/* 소셜 로그인 - Google */}
        <div className="overlap">
          <div className="group">
            <div className="text-google">Google</div>
            <img className="google-image" src="/img/image-61.png" alt="" aria-hidden="true" />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="div-wrap_login" onClick={handleLogin} style={{ cursor: "pointer" }}>
          <div className="text-wrap_login-5">Log In</div>
        </div>

        {/* 소셜 로그인 - Kakao */}
        <div className="group-wrap_login">
          <div className="group-2">
            <div className="image-wrap_login">
              <img className="img" src="/img/image-60.png" alt="" aria-hidden="true" />
            </div>
            <div className="text-wrap_login-6">Kakao Talk</div>
          </div>
        </div>

        {/* 입력 필드 */}
        <Frame
          className="frame_login_id"
          placeholder="Email"
          text="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Frame
          className="frame_login_password"
          placeholder="Password"
          text="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {/* 회원가입 안내 */}
        <div className="group-3">
          <div className="text-wrap_login-7">Don’t have an account?</div>
          <div className="text-wrap_login-8">Create an account</div>
        </div>

        {/* 이메일 로그인 구분선 */}
        <div className="group-4">
          <div className="group-5">
            <div className="text-wrap_login-9">or continue with email</div>
          </div>
          <img className="line" src="/img/line-5.svg" alt="" aria-hidden="true" />
          <img className="line-2" src="/img/line-5.svg" alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};