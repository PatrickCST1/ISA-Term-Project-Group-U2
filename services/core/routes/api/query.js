const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'text is required' });
    }

    try {
        const result = await fetch(process.env.MODEL_URL + "/query", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (!result.ok) {
            return res.status(result.status).json({ error: 'Model service error' });
        }

        const data = await result.json();
        
        // Grab the RGB color from the model response
        const color = data.color_rgb;

        // Optionally update the lightbulb with the color if you need to call the lightbulb endpoint here
        // This is a placeholder for wherever the api key should be fetched from.
        if (color && process.env.GOVEE_API_KEY) {
            try {
                // Assuming lightbulbHandler is running or we just call the logic
                // If lightbulb is a separate service, we'd fetch it here.
                // Assuming it's mounted in index.js, we could call it via fetch or import.
                // Updated to use the discrete microservice endpoint when available, fallback to localhost.
                const lightbulbUrl = process.env.LIGHTBULB_URL || `http://localhost:${process.env.PORT || 5000}`;
                await fetch(`${lightbulbUrl}/api/light`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: process.env.GOVEE_API_KEY, color })
                });
            } catch (err) {
                console.error("Failed to update lightbulb color:", err.message);
            }
        }
        
        return res.json(data);
    } catch (err) {
        console.error('Model fetch error:', err.message);
        return res.status(503).json({ error: 'Model service unavailable' });
    }
});

module.exports = router;