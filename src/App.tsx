import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import SignupDetails from "./pages/SignupDetails";
import SignupSuccess from "./pages/SignupSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/details" element={<SignupDetails />} />
      <Route path="/signup/success" element={<SignupSuccess />} />
    </Routes>
  );
}

export default App;
