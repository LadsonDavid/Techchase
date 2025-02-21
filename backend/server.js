const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Supabase setup
const SUPABASE_URL = "https://yusnblwxlcyclszkbccl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1c25ibHd4bGN5Y2xzemtiY2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MjQwMzgsImV4cCI6MjA1NTEwMDAzOH0.vPcE_4kHj2JbNdvb0Xhvy_9e0aEzcmj4z8hdyA9clPw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// User Authentication (Signup/Login)
app.post("/signup", async (req, res) => {
    const { email, password, role } = req.body;
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    await supabase.from("users").insert([{ id: user.id, email, role }]);
    res.json({ message: "Signup successful", user });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Login successful", user });
});

// Admin: Create Room (Always with 2 Levels & 3 Questions per Level)
app.post("/admin/create-room", async (req, res) => {
    const { roomName } = req.body;
    const { data, error } = await supabase.from("rooms").insert([{ name: roomName }]).select();
    if (error) return res.status(400).json({ error: error.message });

    const roomId = data[0].id;
    let questions = [];
    for (let level = 1; level <= 2; level++) {
        for (let i = 1; i <= 3; i++) {
            questions.push({ room_id: roomId, level, question_text: `Question ${i} for Level ${level}` });
        }
    }
    await supabase.from("questions").insert(questions);
    res.json({ message: "Room created with default questions", roomId });
});

// Admin: View Active Rooms
app.get("/admin/active-rooms", async (req, res) => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// Participant: Select Language
app.post("/participant/select-language", async (req, res) => {
    const { userId, language } = req.body;
    await supabase.from("participants").update({ language }).eq("id", userId);
    res.json({ message: "Language updated" });
});

// Participant: Submit Answer
app.post("/participant/submit", async (req, res) => {
    const { userId, questionId, answer, timeTaken } = req.body;
    await supabase.from("submissions").insert([{ user_id: userId, question_id: questionId, answer, time_taken: timeTaken }]);
    res.json({ message: "Answer submitted" });

    // Leaderboard update
    io.emit("updateLeaderboard");
});

// Get Leaderboard Data
app.get("/leaderboard", async (req, res) => {
    const { data, error } = await supabase.from("leaderboard").select("*").order("points", { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// Real-time Leaderboard Updates
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));
