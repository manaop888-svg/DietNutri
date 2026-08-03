import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Paste your API key here (starts with AQ... or AIza...) inside quotes:
const API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6JY2ka-BeQ5RRSAHKN4Ko_fRsCzXcmnhxH5X-39yPyAfg";

// 🌐 1. DIRECT BROWSER TEST ROUTE
app.get('/', async (req, res) => {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Say 'NutriAI is online!'" }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.send(`<h1>❌ API Error</h1><pre>${JSON.stringify(data.error, null, 2)}</pre>`);
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.send(`<h1>✅ SUCCESS!</h1><p><b>AI Response:</b> ${reply}</p>`);
    } catch (err) {
        res.send(`<h1>❌ Server Error</h1><p>${err.message}</p>`);
    }
});

// 💬 2. API CHAT ROUTE
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
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

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (error) {
        console.error("Server Catch Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NutriAI Backend running on port ${PORT}`));
