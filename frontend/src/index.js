// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // 확장자 바뀐 거 주의
//import "./index.css"; // 있다면

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);