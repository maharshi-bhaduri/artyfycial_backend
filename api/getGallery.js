import * as admin from "firebase-admin";
import { allowCors } from "../utils/utils"; // Adjust the path as needed

// Check if the app is already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.storageBucket,
  });
}

const storage = admin.storage();
const bucket = storage.bucket();

const listFiles = async function (req, res) {
  try {
    const [files] = await bucket.getFiles({ prefix: 'images/' });

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

    console.log('Files:', fileInfos);

    return res.status(200).json({ files: fileInfos });
  } catch (error) {
    console.log('Error listing files', error);
    return res.status(500).json({ error: 'Error listing files' });
  }
};

module.exports = allowCors(listFiles);
