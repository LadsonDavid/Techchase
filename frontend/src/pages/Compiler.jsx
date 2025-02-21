//Compiler.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import supabase from "../supabaseClient";
import { ClipLoader } from "react-spinners";
import { gradientBg, cardStyle, glowEffect } from '../styles/SharedStyles';

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const Compiler = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(state?.language || "python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const languageMapping = {
    python: "python",
    cpp: "cpp",
    java: "java",
    c: "c",
    javascript: "javascript",
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setOutput("");

    try {
      const { data } = await axios.post(PISTON_API_URL, {
        language: languageMapping[language],
        version: "*",
        files: [{ content: code }],
      });

      setOutput(data.run.stdout || "No output");

      if (data.run.stdout?.trim() === "Expected Output") {
        await supabase
          .from("users")
          .update({ points: 100 })
          .eq("email", state?.email);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error executing code.");
    }

    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen ${gradientBg} p-6`}>
      <div className={`${cardStyle} max-w-4xl mx-auto p-8 ${glowEffect}`}>
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Fabulous Code Editor
        </h2>

        <div className="space-y-6">
          <div>
            <label className="text-purple-300 text-sm font-medium block mb-2">
              Choose Your Programming Language
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
          </div>

          <div>
            <label className="text-purple-300 text-sm font-medium block mb-2">
              Write Your Spectacular Code
            </label>
            <textarea
              className="w-full h-64 px-4 py-3 rounded-lg bg-gray-700/50 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Let your code shine..."
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <ClipLoader size={20} color="#fff" />
                  <span>Creating Magic...</span>
                </div>
              ) : (
                "Run Code"
              )}
            </button>

            <button
              onClick={() => navigate("/leaderboard")}
              className="flex-1 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
            >
              View Champions
            </button>
          </div>

          {output && (
            <div className="mt-6 rounded-lg bg-gray-700/50 p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                ✨ Output
              </h3>
              <pre className="text-green-400 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compiler;
