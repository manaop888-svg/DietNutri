import express from 'express';
import cors from 'cors';

const app = express();

// Allow request handling
app.use(cors());
app.use(express.json());

// Pull key from Render's Environment Variables (or hardcode fallback)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6IFbehS4cqfU22w5-jgMV_BSuSXT3G27kdPPKnqofLjqA";

// 🌐 1. Home / Diagnostic Route (Opens in Browser)
app.get('/', async (req, res) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Respond with: 'Backend status: ACTIVE!'" }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.send(`<h2>❌ API Error Details:</h2><pre>${JSON.stringify(data.error, null, 2)}</pre>`);
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.send(`<h2>✅ Success!</h2><p><b>Gemini Output:</b> ${reply}</p>`);
    } catch (err) {
        res.send(`<h2>❌ Server Error:</h2><p>${err.message}</p>`);
    }
});

// 💬 2. Frontend Chat API Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: "You are NutriAI, an expert global nutritionist." }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const replyText = data.candidates[0].content.parts[0].text;
        res.json({ reply: replyText });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NutriAI Server running on port ${PORT}`));
