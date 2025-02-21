// src/pages/Participant.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "./Leaderboard";

const Participant = () => {
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();

  const handleLanguageSelection = (lang) => {
    setLanguage(lang);
    navigate("/compiler");
  };

  return (
    <div>
      <h2>Participant Page</h2>
      <select onChange={(e) => handleLanguageSelection(e.target.value)}>
        <option value="">Select Language</option>
        <option value="c">C</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <Leaderboard />
    </div>
  );
};

export default Participant;
