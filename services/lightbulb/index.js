const express = require('express');
const cors = require('cors');
const lightbulbRouter = require('./light');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount the route we created earlier
app.use('/api/light', lightbulbRouter);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
    console.log(`Lightbulb microservice running on port ${port}`);
});
