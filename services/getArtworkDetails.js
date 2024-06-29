import { allowCors, getBucket } from "../utils/utils.js"; // Adjust the path as needed
import axios from "axios";

const getArtworkDetails = async function (req, res) {
    try {
        const bucket = getBucket();
        const { artworkId } = req.query;

        if (!artworkId) {
            return res.status(400).json({ error: "artworkId is required" });
        }

        try {
            // Fetch the artwork details from the third-party API
            const response = await axios.get(`${process.env.CF_GET_ARTWORK_DATA}?artworkId=${artworkId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const artworkDetails = response.data;
            const filePath = artworkDetails.path;

            if (!filePath) {
                return res.status(404).json({ error: "Artwork path not found" });
            }

            // Get the presigned URL for the file
            const fileRef = bucket.file(filePath);
            const [url] = await fileRef.getSignedUrl({
                action: 'read',
                expires: Date.now() + 60 * 60 * 1000, // Set expiration to 1 hour from now
            });

            // Append the presigned URL to the artwork details
            artworkDetails.url = url;

            return res.status(200).json(artworkDetails);
        } catch (error) {
            console.log("Error fetching artwork details (firebase/cloudflare):", error);
            return res.status(500).json({ error: "Error fetching artwork details" });
        }
    } catch (error) {
        console.log("Error processing request", error);
        return res.status(500).json({ error: "Error processing request" });
    }
};

export default allowCors(getArtworkDetails);
