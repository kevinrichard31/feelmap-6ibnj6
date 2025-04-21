// TimeSpent.tsx
import React, { useEffect } from "react";
import { useTimeStore } from "../store/timeStore";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s < 10 ? "0" : ""}${s}s`;
};

const TimeSpent: React.FC = () => {
  const { secondsSpent, increment } = useTimeStore();

  useEffect(() => {
    const interval = setInterval(() => {
      increment(); // 🔁 Incrémente toutes les secondes
    }, 1000);

    return () => clearInterval(interval); // Clean on unmount
  }, [increment]);

  return (
    <div style={{ padding: "1rem", fontWeight: "bold" }}>
      Temps passé sur l'app : {formatTime(secondsSpent)}
    </div>
  );
};

export default TimeSpent;
