import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddHabit from "./pages/AddHabit";
import HabitDetail from "./pages/HabitDetail";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="logo">HabitTracker</Link>
        <nav>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddHabit />} />
          <Route path="/habit/:id" element={<HabitDetail />} />
          {/* placeholder for analytics / settings */}
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>

    </div>
  );
}
