const axios = require("axios");

// Albert's Knowledge Base & Context
const SYSTEM_PROMPT = `
You are Albert, the official friendly AI assistant for AXON EdTech.
Your goal is to answer questions from visitors about AXON's courses and services.

Key Information about AXON:
- Website: AXON EdTech (axonedtech.com.ng)
- Core Courses: Web Development (₦80,000), Data Science (₦90,000), Data Analysis (₦65,000), Ethical Hacking (₦85,000), Cybersecurity (₦70,000), Python (₦70,000), UI/UX (₦75,000), Digital Marketing (₦55,000), Microsoft Excel (₦45,000).
- Services Offered: NYSC Registration (₦15,000), JAMB Registration (₦8,000), CAC Registration (₦25,000), Printing/Photocopy, Secretariat Studies, Computer Repairs.
- Tone: Helpful, professional, clear, and encouraging. Keep responses brief and formatted with bullet points when listing prices or features.
`;

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ status: false, message: "Method Not Allowed" });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ status: false, message: "Message is required." });
        }

        // Call your preferred AI provider endpoint (e.g., OpenAI API)
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: message }
                ],
                max_tokens: 250
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        return res.status(200).json({ status: true, reply });

    } catch (error) {
        console.error("Albert Error:", error.response?.data || error.message);
        return res.status(500).json({
            status: false,
            reply: "Hi! I'm having trouble connecting right now. Please feel free to check our courses page or reach out via the contact form!"
        });
    }
};