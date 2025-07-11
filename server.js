const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for food analysis
app.post('/api/analyze-food', async (req, res) => {
    try {
        const { image } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are a nutrition expert. Analyze the food image and provide a detailed response in JSON format with the following structure: {\"name\": \"Food Name\", \"calories\": number, \"confidence\": number_between_0_and_1, \"description\": \"brief description\", \"activities\": [{\"name\": \"Activity Name\", \"duration\": \"X minutes\", \"icon\": \"feather_icon_name\"}]}. Provide 3 activities to burn the estimated calories. Use appropriate feather icon names like 'zap', 'bike', 'heart', 'activity', 'walk', 'mountain', 'droplet', 'music', 'trending-up', 'circle', 'home'."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please analyze this food image and tell me what food it is, estimate the calories, and suggest 3 activities to burn those calories. Respond in JSON format."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${image}`
                            }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500
        });

        const analysisResult = JSON.parse(response.choices[0].message.content);
        
        // Validate and format the response
        const result = {
            name: analysisResult.name || 'Unknown Food',
            calories: analysisResult.calories || 300,
            icon: 'coffee', // Default icon
            activities: analysisResult.activities || getDefaultActivities(analysisResult.calories || 300),
            confidence: analysisResult.confidence || 0.7,
            description: analysisResult.description || ''
        };

        res.json(result);

    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze image',
            details: error.message 
        });
    }
});

// Fallback activities based on calories
function getDefaultActivities(calories) {
    const walkingMinutes = Math.round(calories / 4); // ~4 calories per minute walking
    const runningMinutes = Math.round(calories / 10); // ~10 calories per minute running
    const cyclingMinutes = Math.round(calories / 8); // ~8 calories per minute cycling
    
    return [
        { name: "Walking", duration: `${walkingMinutes} minutes`, icon: "walk" },
        { name: "Running", duration: `${runningMinutes} minutes`, icon: "zap" },
        { name: "Cycling", duration: `${cyclingMinutes} minutes`, icon: "bike" }
    ];
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Analyzer PWA server running on port ${PORT}`);
});