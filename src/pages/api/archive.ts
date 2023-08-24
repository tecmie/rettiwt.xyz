import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Export the vector file-based databases from the production site.
 * This is a temporary fix and should be replaced with a more robust solution.
 *
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 */
export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Check if the key query parameter is present and has the correct value
  const key = req.query.key;
  if (key !== 'omo_naija') {
    return res.status(403).send('Forbidden');
  }

  // Define the folder to be zipped
  const folderToZip = path.join(process.cwd(), 'vectors');

  // Check if the folder exists
  if (!fs.existsSync(folderToZip)) {
    return res.status(404).send('Folder not found');
  }

  // Set the response headers
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=vectors.zip');

  // Create a ZIP archive
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level
  });

  // Pipe the archive to the response
  archive.pipe(res);

  // Append the folder to the archive
  archive.directory(folderToZip, false);

  // Finalize the archive
  await archive.finalize();

  // Handle errors
  archive.on('error', (err) => {
    console.error(err);
    res.status(500).send('An error occurred while creating the ZIP file');
  });
}
