import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Put your exact Google AI Studio key inside quotes below
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JY2ka-BeQ5RRSAHKN4Ko_fRsCzXcmnhxH5X-39yPyAfg");

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are NutriAI, an expert nutritionist. User request: ${message}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NutriAI Backend running on port ${PORT}`));
