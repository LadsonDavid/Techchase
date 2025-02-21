// src/pages/Leaderboard.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("name, points")
        .order("points", { ascending: false });

      if (!error) {
        setPlayers(data);
      }
    };

    fetchLeaderboard();

    const leaderboardSubscription = supabase
      .channel("realtime leaderboard")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "leaderboard" }, fetchLeaderboard)
      .subscribe();

    return () => {
      supabase.removeChannel(leaderboardSubscription);
    };
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.name} - {player.points} Points</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
