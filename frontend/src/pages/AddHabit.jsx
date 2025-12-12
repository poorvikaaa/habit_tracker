import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AddHabit() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("boolean");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { title, type, frequency: { mode: "daily" } };
      await api.post("/habits", body);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page add-habit">
      <h2>Add Habit</h2>
      <form onSubmit={submit} className="form">
        <label>Title
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>

        <label>Type
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="boolean">Yes/No</option>
            <option value="quantity">Quantity</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
