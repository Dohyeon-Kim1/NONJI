import React from "react";
import { Routes, Route } from "react-router-dom";
import { Screen } from "./pages/Login/Screen";
import { Home } from "./pages/Home/Home";
import { LandingPage } from "./pages/LandingPage";
//import { LandingPage } from "../../landing/src/screens/LandingPage/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Screen />} />
      <Route path="/home" element={<Home />} />
      <Route path="/LandingPage" element={<LandingPage />} />
    </Routes>
  );
}

export default App;