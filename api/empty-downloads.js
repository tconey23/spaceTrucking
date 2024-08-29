// api/empty-downloads.js
import { readdir, unlink } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const downloadsPath = '/tmp';

  try {
    const files = await readdir(downloadsPath);

    if (files.length === 0) {
      return res.status(200).json({ message: 'The downloads folder is already empty.' });
    }

    await Promise.all(files.map(file => unlink(path.join(downloadsPath, file))));

    res.status(200).json({ message: 'All files in the downloads folder have been deleted.' });
  } catch (error) {
    console.error('Error emptying the downloads folder:', error);
    res.status(500).json({ error: 'Error emptying the downloads folder.' });
  }
}