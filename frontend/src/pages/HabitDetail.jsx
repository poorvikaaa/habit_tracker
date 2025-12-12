import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { getDayRange } from "../utils/dateHelpers";

export default function HabitDetail() {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [hRes, eRes] = await Promise.all([
          api.get(`/habits/${id}`),
          api.get("/entries", { params: { habitId: id, ...getDayRange(7) } })
        ]);
        setHabit(hRes.data);
        setHistory(eRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <div className="center">Loading...</div>;
  if (!habit) return <div>Habit not found</div>;

  const completedDays = history.filter(h => h.value >= 1).length;

  return (
    <div className="page habit-detail">
      <h2>{habit.title}</h2>
      <div className="meta">
        <div>Type: {habit.type}</div>
        <div>Completed in last 7 days: {completedDays} / 7</div>
      </div>

      <div className="history">
        <h3>Last 7 days</h3>
        <ul>
          {history.map((d) => (
            <li key={d.dayKey}>
              <strong>{d.dayKey}</strong> — {d.value >= 1 ? "Done" : "Missed"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
