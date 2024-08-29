const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 5001;

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

app.delete('/empty-downloads', (req, res) => {
    const downloadsPath = path.join(__dirname, 'downloads');

    // Read the contents of the downloads folder
    fs.readdir(downloadsPath, (err, files) => {
        if (err) {
            console.error('Error reading the downloads folder:', err);
            return res.status(500).send('Error reading the downloads folder.');
        }

        // If there are no files, respond accordingly
        if (files.length === 0) {
            return res.send('The downloads folder is already empty.');
        }

        // Loop through the files and delete each one
        files.forEach((file) => {
            console.log(file)
            const filePath = path.join(downloadsPath, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${file}:`, err);
                } else {
                    console.log(`File ${file} deleted successfully.`);
                }
            });
        });

        res.send('All files in the downloads folder have been deleted.');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
