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
        return res.json(data);
    } catch (err) {
        console.error('Model fetch error:', err.message);
        return res.status(503).json({ error: 'Model service unavailable' });
    }
});

module.exports = router;