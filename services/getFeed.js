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

            // await file.setMetadata({
            //     cacheControl: 'public, max-age=86400', // Cache for 24 hours (86400 seconds)
            // });

            const options = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 24,
                responseDisposition: 'inline',
                responseType: 'image/jpeg',
                virtualHostedStyle: true,
            };

            // Await the promise and destructure the result
            const [url] = await file.getSignedUrl(options);

            console.log("signed url: ", url)

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
