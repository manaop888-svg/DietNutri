import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// Set your key string directly (or use environment variable)
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6JY2ka-BeQ5RRSAHKN4Ko_fRsCzXcmnhxH5X-39yPyAfg";
const genAI = new GoogleGenerativeAI(apiKey);

// 🌐 1. DIRECT BROWSER TEST ROUTE
app.get('/', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'NutriAI Server is fully operational!'");
        const responseText = result.response.text();
        
        res.send(`<h1>✅ SUCCESS!</h1><p><b>AI Output:</b> ${responseText}</p>`);
    } catch (error) {
        console.error("Test Error:", error);
        res.send(`<h1>❌ ERROR</h1><p>${error.message}</p>`);
    }
});

// 💬 2. API CHAT ROUTE
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`You are NutriAI, an expert nutritionist. User: ${message}`);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NutriAI Backend running on port ${PORT}`));
