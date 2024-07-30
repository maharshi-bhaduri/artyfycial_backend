import { allowCors, getBucket } from "../utils/utils.js";
import axios from "axios";

const generatePresignedUrl = async function (bucket, data) {
  const file = bucket.file(data.path);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, //expiration set to one hour
  });
  return { ...data, url: url };
};

const getMarketPlace = async function (req, res) {
  try {
    const bucket = getBucket();
    const response = await axios.get(process.env.CF_GET_MARKETPLACE);
    const data = response.data;

    const marketPlaceData = await Promise.all(
      data.map((datum) => generatePresignedUrl(bucket, datum))
    );
    return res.status(200).json(marketPlaceData);
  } catch (error) {
    console.log("Error processing data");
    return res.status(500).json({ error: "Error processing data" });
  }
};

export default allowCors(getMarketPlace);
