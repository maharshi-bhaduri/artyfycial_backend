import axios from "axios";
import { allowCors, getBucket } from "../utils/utils.js";

const getArtworkList = async function (req, res) {
    try {
        const bucket = getBucket();
        const { artistId, current, searchQuery, searchOthers, limit } = req.query;

        // Fetch data from the getMoreArtworks API
        const response = await axios.get(process.env.CF_GET_ARTWORK_LIST_DATA, {
            params: {
                artistId,
                current,
                searchQuery,
                searchOthers,
                limit
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

export default allowCors(getArtworkList);
