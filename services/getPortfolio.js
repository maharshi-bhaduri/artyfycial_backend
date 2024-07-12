import axios from "axios";
import { allowCors, getBucket } from "../utils/utils.js";

const getPortfolio = async function (req, res) {
    try {
        const bucket = getBucket();
        const { userName } = req.query;

        // Fetch artist details
        const portfolioResponse = await axios.get(process.env.CF_GET_PORTFOLIO_DATA, {
            params: {
                userName
            },
        });

        const artistDetails = portfolioResponse.data.artist;
        const artworks = portfolioResponse.data.artworks;

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

        return res.status(200).json({ artist: artistDetails, artworks: updatedArtworks });
    } catch (error) {
        console.log('Error fetching or processing data', error);
        return res.status(500).json({ error: 'Error fetching or processing data' });
    }
};

export default allowCors(getPortfolio);
