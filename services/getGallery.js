import { allowCors, getBucket } from "../utils/utils.js"; // Adjust the path as needed


const getGallery = async function (req, res) {
  try {
    const bucket = getBucket();
    const [files] = await bucket.getFiles({ prefix: 'images/' });
    console.log(files)
    const fileInfos = await Promise.all(files.slice(0, 6).map(async file => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000 // Set expiration to 1 hour from now
      });
      return {
        name: file.name,
        url: url
      };
    }));

    return res.status(200).json({ files: fileInfos });
  } catch (error) {
    console.log('Error listing files', error);
    return res.status(500).json({ error: 'Error listing files' });
  }
};

export default allowCors(getGallery);
