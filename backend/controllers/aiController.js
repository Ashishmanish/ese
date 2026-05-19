const axios = require('axios');
const Complaint = require('../models/Complaint');

// @desc    Analyze a complaint using AI and update it
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res) => {
    try {
        const { complaintId } = req.body;

        if (!complaintId) {
            return res.status(400).json({ message: 'Complaint ID is required' });
        }

        const complaint = await Complaint.findById(complaintId);
        
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const prompt = `
        Analyze the following complaint:
        Title: ${complaint.title}
        Description: ${complaint.description}
        Category: ${complaint.category}

        Please provide the following information in strict JSON format without any markdown formatting or extra text:
        {
            "priority": "High/Medium/Low based on urgency",
            "department": "The concerned department responsible",
            "summary": "A short 1-2 sentence summary of the issue",
            "autoResponse": "A polite auto-reply message for the user acknowledging the specific issue"
        }`;

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'google/gemini-2.5-flash-1124', // Or any openrouter model that supports fast inference
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:5000',
                    'Content-Type': 'application/json'
                }
            }
        );

        let resultText = response.data.choices[0].message.content;
        
        // Remove markdown formatting if the model still outputs it
        resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const aiAnalysis = JSON.parse(resultText);

        // Update the complaint with AI analysis
        complaint.aiPriority = aiAnalysis.priority;
        complaint.aiDepartment = aiAnalysis.department;
        complaint.aiSummary = aiAnalysis.summary;
        complaint.aiResponse = aiAnalysis.autoResponse;

        await complaint.save();

        res.status(200).json(complaint);
    } catch (error) {
        console.error("AI Error:", error.response?.data || error.message);
        res.status(500).json({ message: 'AI Analysis failed' });
    }
};

module.exports = { analyzeComplaint };
