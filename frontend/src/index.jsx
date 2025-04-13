import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App.jsx가 제대로 export 되어 있어야 함
import { BrowserRouter } from "react-router-dom";
// import "./index.css"; ← 이건 주석 처리해도 괜찮음

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);