const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 5000;

// Use CORS to allow requests from localhost:3000
app.use(cors({
    origin: 'http://localhost:3000', // Allow only requests from this origin
}));

// Serve files from the downloads directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.get('/fetch-gltf', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('No URL provided.');
    }

    try {
        const fileName = path.basename(url); // Get the file name from the URL
        const localPath = path.join(__dirname, 'downloads', fileName);

        // Check if the file already exists locally
        if (fs.existsSync(localPath)) {
            return res.sendFile(localPath);
        }

        // Fetch the GLTF file from the provided URL
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        // Save the file locally
        const writer = fs.createWriteStream(localPath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            return res.sendFile(localPath); // Serve the file once it's saved
        });

        writer.on('error', (err) => {
            console.error('Error writing the file', err);
            return res.status(500).send('Error saving the file.');
        });
    } catch (error) {
        console.error('Error fetching the GLTF file:', error);
        return res.status(500).send('Error fetching the GLTF file.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
