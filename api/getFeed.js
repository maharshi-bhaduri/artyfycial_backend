import * as admin from "firebase-admin";
import axios from "axios";
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
        // Fetch data from the getdata API
        const response = await axios.get(process.env.CF_GET_FEED_DATA, {
            params: {
                page: req.query.page,
            },
        });

        const artworks = response.data;

        // Generate presigned URLs for each artwork path
        const updatedArtworks = await Promise.all(artworks.map(async (artwork) => {
            const file = bucket.file(artwork.path);
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 60 * 60 * 1000, // Set expiration to 1 hour from now
            });
            return {
                ...artwork,
                url: url,
            };
        }));

        return res.status(200).json({ artworks: updatedArtworks });
    } catch (error) {
        console.log('Error fetching or processing data', error);
        return res.status(500).json({ error: 'Error fetching or processing data' });
    }
};

module.exports = allowCors(listFiles);
