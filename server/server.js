import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Gemini Food Plan API
app.post("/api/gemini-food", async (req, res) => {
  const { calories, sex, weight, height, age, goal } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create a daily meal plan for a ${age}-year-old ${sex}, ${weight}kg, ${height}cm, goal: ${goal}, target calories: ${calories}. Return as a simple bullet list of foods with portions.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const plan =
      data.candidates?.[0]?.content?.parts?.[0]?.text
        ?.split("\n")
        .filter((line) => line.trim()) || [];

    res.json({ foodPlan: plan });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to fetch Gemini response" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
