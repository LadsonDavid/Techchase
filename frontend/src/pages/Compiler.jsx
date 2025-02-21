//Compiler.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { ClipLoader } from "react-spinners";

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
          .from("leaderboard")
          .upsert([{ name: "Participant", points: 100 }]);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error executing code.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-6">Code Compiler</h2>

        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Select Language:</label>
          <select
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
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

        {/* Code Editor */}
        <label className="block text-gray-300 text-sm mb-2">Write Your Code:</label>
        <textarea
          className="w-full h-52 p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Start coding here..."
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="bg-green-500 px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <ClipLoader size={20} color="#fff" />
                Running...
              </div>
            ) : (
              "Run Code"
            )}
          </button>

          <button
            className="bg-blue-500 px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            onClick={() => navigate("/leaderboard")}
          >
            View Leaderboard
          </button>
        </div>

        {/* Output Section */}
        {output && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Output:</h3>
            <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;
