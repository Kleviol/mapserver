const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS module
const app = express();
const port = 3000;

// Enable CORS for all requests. Customize as needed for production.
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle coordinates post requests
app.post('/coordinates', async (req, res) => {
    // Extract wifiAccessPoints from the request body
    const data = {
        considerIp: "false",
        wifiAccessPoints: req.body.wifiAccessPoints
    };

    // Dynamic import of node-fetch, as it is an ES module
    const fetch = (await import('node-fetch')).default;

    try {
        // Making a POST request to the Google Geolocation API
        const response = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBVyG1_D8B3i2nJwSkt1rAWL2TYtJ87_mY', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Check if the Google API responded with an error
        if (!response.ok) {
            throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
        }

        // Parsing the JSON response from the Google API
        const location = await response.json();
        console.log('Location data received:', location);
        res.json(location);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}`));
