import { allowCors, getBucket } from "../utils/utils.js";

const getArtworkListNew = async function (req, res) {
  try {
    console.log("hello");
    const bucket = getBucket();
    const { artworks } = req.body; // Extract the list of artwork objects from the request body

    if (!Array.isArray(artworks) || artworks.length === 0) {
      return res.status(400).json({ error: "Invalid artworks list" });
    }
    // Generate presigned URLs for each artwork path
    const updatedArtworks = await Promise.all(
      artworks.map(async (artwork) => {
        const file = bucket.file(artwork.path);
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 60 * 60 * 1000, // Set expiration to 1 hour from now
        });
        return {
          ...artwork,
          url: url,
        };
      })
    );
    console.log("updatedArtworks ", updatedArtworks);

    return res.status(200).json({ artworks: updatedArtworks });
  } catch (error) {
    console.log("Error fetching or processing data", error);
    return res.status(500).json({ error: "Error fetching or processing data" });
  }
};

export default allowCors(getArtworkListNew);
