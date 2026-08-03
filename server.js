import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// Put your key here (or use GEMINI_API_KEY environment variable in Render)
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6IZDcaCs2WShMBfJj7ljMLaquc03GQ2UUrfwQT0TdTfkA";
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are NutriAI, an expert global nutritionist."
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NutriAI Backend running on port ${PORT}`));
