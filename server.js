import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

// Set your API key here (keep the double quotes around your key!)
const apiKey = process.env.GEMINI_API_KEY || "
AQ.Ab8RN6IZDcaCs2WShMBfJj7ljMLaquc03GQ2UUrfwQT0TdTfkA";
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are NutriAI, an expert global nutritionist.`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NutriAI Backend running on port ${PORT}`));
