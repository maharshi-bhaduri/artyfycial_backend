import { allowCors, getBucket } from "../utils/utils.js"; // Adjust the path as needed
import axios from "axios";

const deleteImage = async function (req, res) {
  try {
    const bucket = getBucket();
    const { artworkId } = req.body;

    if (!artworkId) {
      return res.status(400).json({ error: "artworkId is required" });
    }

    try {
      // Fetch the artwork details from the database
      const response = await axios.get(`${process.env.CF_GET_ARTWORK_DATA}/${artworkId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const artworkDetails = response.data;
      const filePath = artworkDetails.path;

      if (!filePath) {
        return res.status(404).json({ error: "Artwork path not found" });
      }

      // Delete the artwork entry from the database
      await axios.post(process.env.CF_DELETE_ARTWORK_DATA, { artworkId }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Delete the file from Firebase Storage
      const fileRef = bucket.file(filePath);
      await fileRef.delete();
      console.log("File deleted successfully from Firebase Storage");

      return res.status(200).json({ message: "Artwork deleted successfully" });
    } catch (error) {
      console.log("Error deleting artwork details (firebase/cloudflare):", error);
      return res.status(500).json({ error: "Error deleting artwork" });
    }
  } catch (error) {
    console.log("Error processing delete request", error);
    return res.status(500).json({ error: "Error processing delete request" });
  }
};

export default allowCors(deleteImage);
