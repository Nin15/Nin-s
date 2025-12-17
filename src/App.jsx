import { useEffect, useState } from "react";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Homepage from "../pages/Homepage";
import Profile from "../pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/Sign-in" element={<Signin />} />
      <Route path="/Homepage" element={<Homepage />} />
      <Route path="/Sign-up" element={<Signup />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
