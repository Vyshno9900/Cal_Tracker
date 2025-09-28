import React, { useState } from "react";

export default function VyshnoApp() {
  const [form, setForm] = useState({
    age: 25,
    sex: "male",
    weightKg: 70,
    heightCm: 175,
    goal: "maintain"
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleCalculate(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("https://cal-tracker-1-backend.onrender.com/api/gemini-food", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    age: form.age,
    sex: form.sex,
    weight: form.weightKg,
    height: form.heightCm,
    goal: form.goal,
    calories: 2200
  })
});


    const data = await res.json();
    setResult(data.foodPlan || []);
    setLoading(false);
  }

  return (
    <div className="app">
      <h1>Vyshno AI Food Tracker</h1>
      <form onSubmit={handleCalculate} className="form">
        <input name="age" value={form.age} onChange={onChange} placeholder="Age" />
        <input name="weightKg" value={form.weightKg} onChange={onChange} placeholder="Weight (kg)" />
        <input name="heightCm" value={form.heightCm} onChange={onChange} placeholder="Height (cm)" />
        <select name="sex" value={form.sex} onChange={onChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="goal" value={form.goal} onChange={onChange}>
          <option value="maintain">Maintain</option>
          <option value="bulk">Bulk</option>
          <option value="cut">Cut</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Plan"}
        </button>
      </form>

      {result && (
        <ul className="results">
          {result.map((food, i) => (
            <li key={i}>{food}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
