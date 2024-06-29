import { allowCors } from "../utils/utils.js"; // Adjust the path as needed
import axios from "axios";

const updateArtwork = async function (req, res) {
    try {
        const { artworkId, title, description, isActive, isPublic } = req.body;

        if (!artworkId) {
            return res.status(400).json({ error: "artworkId is required" });
        }

        try {
            // Update the artwork details in the database
            const response = await axios.post(`${process.env.CF_UPDATE_ARTWORK_DATA}`, {
                artworkId,
                title,
                description,
                isActive,
                isPublic
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const updatedArtwork = response.data;

            return res.status(200).json({ message: "Artwork updated successfully", data: updatedArtwork });
        } catch (error) {
            console.log("Error updating artwork details:", error);
            return res.status(500).json({ error: "Error updating artwork" });
        }
    } catch (error) {
        console.log("Error processing update request", error);
        return res.status(500).json({ error: "Error processing update request" });
    }
};

export default allowCors(updateArtwork);
