// api/fetch-gltf.js
import { unlink, access, createWriteStream } from 'fs';
import path from 'path';
import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided.' });
  }

  const fileName = path.basename(url);
  const localPath = path.join('/tmp', fileName);

  // Check if the file already exists locally
  try {
    await access(localPath);
    return res.sendFile(localPath);
  } catch (error) {
    // File doesn't exist, proceed to download
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = createWriteStream(localPath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      res.sendFile(localPath);
    });

    writer.on('error', (err) => {
      console.error('Error writing the file', err);
      res.status(500).json({ error: 'Error saving the file.' });
    });
  } catch (error) {
    console.error('Error fetching the GLTF file:', error);
    res.status(500).json({ error: 'Error fetching the GLTF file.' });
  }
}