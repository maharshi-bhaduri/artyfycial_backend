import axios from "axios";
import { allowCors, getBucket } from "../utils/utils.js"; // Adjust the path as needed


const getFeed = async function (req, res) {
    try {
        const bucket = getBucket();
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

export default allowCors(getFeed);
