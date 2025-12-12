import React from "react";
import { Link } from "react-router-dom";

export default function HabitCard({ habit, entry, onToggle }) {
  const done = entry && entry.value >= 1;
  return (
    <div className={`habit-card ${done ? "done" : ""}`}>
      <div className="left">
        <button className="toggle" onClick={onToggle}>{done ? "✓" : "○"}</button>
        <div className="meta">
          <div className="title">{habit.title}</div>
          <div className="muted">{habit.frequency?.mode || "daily"}</div>
        </div>
      </div>
      <div className="right">
        <Link to={`/habit/${habit._id}`} className="muted">Details →</Link>
      </div>
    </div>
  );
}
