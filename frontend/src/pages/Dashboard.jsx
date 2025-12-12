import React, { useEffect, useState } from "react";
import api from "../api";
import HabitCard from "../components/HabitCard";
import ProgressRing from "../components/ProgressRing";
import { getTodayKey } from "../utils/dateHelpers";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);

  const todayKey = getTodayKey();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [hRes, eRes] = await Promise.all([
          api.get("/habits"),
          api.get("/entries", { params: { start: todayKey, end: todayKey } })
        ]);
        setHabits(hRes.data || []);
        // normalize entries into map by habitId
        const map = {};
        (eRes.data || []).forEach((entry) => {
          map[entry.habitId] = entry;
        });
        setEntries(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [todayKey]);

  const completedCount = habits.filter(h => entries[h._id] && entries[h._id].value >= 1).length;
  const total = habits.length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  const toggleDone = async (habit) => {
    // optimistic UI: update local state immediately
    const habitId = habit._id;
    const wasDone = entries[habitId] && entries[habitId].value >= 1;
    const newMap = { ...entries };
    if (wasDone) {
      delete newMap[habitId];
      setEntries(newMap);
      try {
        // delete entry if your API supports it, otherwise patch
        await api.delete(`/entries/${habitId}`, { data: { dayKey: todayKey } });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // mark done
    newMap[habitId] = { habitId, dayKey: todayKey, value: 1 };
    setEntries(newMap);

    try {
      await api.post("/entries", { habitId });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="center">Loading...</div>;

  return (
    <div className="page dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Good day —</h2>
          <div className="muted">Today — {todayKey}</div>
        </div>
        <div className="progress-wrapper">
          <ProgressRing percent={percent} size={64} stroke={8} />
          <div>{percent}%</div>
        </div>
      </div>

      <div className="habit-list">
        {habits.length === 0 && (
          <div className="empty">
            No habits yet. <Link to="/add">Add your first habit</Link>
          </div>
        )}
        {habits.map((h) => (
          <HabitCard
            key={h._id}
            habit={h}
            entry={entries[h._id]}
            onToggle={() => toggleDone(h)}
          />
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <Link to="/add" className="btn">+ Add Habit</Link>
      </div>
    </div>
  );
}
