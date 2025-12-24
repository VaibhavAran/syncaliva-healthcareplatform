// server/routes/nutrition.js
import express from "express";
import admin from "firebase-admin";
import fetch from "node-fetch";

const router = express.Router();

// Authenticate middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized - no token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verify failed:", err);
    res.status(401).json({ error: "Unauthorized - invalid token" });
  }
};

// POST /api/nutrition/plan
router.post("/plan", authenticate, async (req, res) => {
  const { age, state, disease, vegPreference = "veg" } = req.body;
  if (!age || !state || !disease)
    return res.status(400).json({ error: "Missing profile info" });

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return res.status(500).json({ error: "Missing API key" });

    const prompt = `
You are a nutritionist. Generate a balanced diet plan in JSON format only.

User details:
- Age: ${age}
- State: ${state}
- Disease: ${disease}
- Preference: ${vegPreference}

Rules:
1. JSON keys: breakfast, lunch, snacks, dinner, avoid
2. Each key value: array of strings (food items)
3. Meals must have items, avoid must list foods to avoid
4. If veg: only vegetarian foods. If non-veg: at least 2 non-veg items.
5. Avoid items should not appear in any meal.
6. Use foods commonly available in ${state}.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    const textResponse = data?.choices?.[0]?.message?.content || "";
    const match = textResponse.match(/\{[\s\S]*\}/);

    if (!match) return res.status(500).json({ error: "AI did not return JSON" });

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    // Ensure structure
    const safePlan = {
      breakfast: Array.isArray(parsed.breakfast) ? parsed.breakfast : [],
      lunch: Array.isArray(parsed.lunch) ? parsed.lunch : [],
      snacks: Array.isArray(parsed.snacks) ? parsed.snacks : [],
      dinner: Array.isArray(parsed.dinner) ? parsed.dinner : [],
      avoid: Array.isArray(parsed.avoid) ? parsed.avoid : [],
    };

    // Check overlap
    const meals = [...safePlan.breakfast, ...safePlan.lunch, ...safePlan.snacks, ...safePlan.dinner];
    const overlap = safePlan.avoid.some(a => meals.some(m => m.toLowerCase().includes(a.toLowerCase())));
    if (overlap) return res.status(500).json({ error: "AI contradiction detected, please regenerate." });

    return res.json(safePlan);

  } catch (err) {
    console.error("Error generating plan:", err);
    return res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

export default router;
