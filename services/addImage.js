import formidable from "formidable-serverless";
import * as fs from "fs";
import * as util from "util";
import { allowCors, getBucket } from "../utils/utils.js"; // Adjust the path as needed
import axios from "axios";
import Jimp from "jimp";
import crypto from "crypto";

const MAX_SIZE = 250 * 1024; // 250 KB

const addImage = async function (req, res) {
  try {
    const bucket = getBucket();
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const imageFile = files.image;
      const data = fields.data ? JSON.parse(fields.data) : {};
      console.log("data is ", data);
      if (!imageFile) {
        return res.status(400).json({ error: "No image provided" });
      }

      const readFile = util.promisify(fs.readFile);
      const fileBuffer = await readFile(imageFile.path);

      let quality = 100; // Starting quality
      let resizedBuffer;

      let image = await Jimp.read(fileBuffer);

      // Only resize if the image is larger than 1024 pixels wide
      if (image.bitmap.width > 1024) {
        image.resize(1024, Jimp.AUTO);
      }

      // Compress the image and adjust quality
      resizedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

      console.log("initial size: ", resizedBuffer.length);

      // Dynamically reduce quality until the image is under 250 KB
      while (resizedBuffer.length > MAX_SIZE && quality > 10) {
        quality -= 5;
        resizedBuffer = await image
          .quality(quality)
          .getBufferAsync(Jimp.MIME_JPEG);
      }

      if (resizedBuffer.length > MAX_SIZE) {
        return res
          .status(500)
          .json({ error: "Unable to reduce image size under 250 KB" });
      }

      console.log("final size: ", resizedBuffer.length);

      // Generate a unique file name
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 10000).toString();
      const hash = crypto
        .createHash("sha256")
        .update(timestamp + randomNum)
        .digest("hex");
      const filePath = `images/${hash}.jpeg`;

      data["path"] = filePath;

      const fileRef = bucket.file(filePath);

      try {
        // Upload file to Firebase Storage
        await fileRef.save(resizedBuffer, {
          metadata: { contentType: Jimp.MIME_JPEG, cacheControl: 'public, max-age=86400' },
        });

        // Get the public URL of the uploaded file
        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        console.log("File is available at", downloadURL);

        // Axios post call
        await axios.post(process.env.CF_ADD_ARTWORK_DATA, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        return res.status(200).json({ imageUrl: downloadURL });
      } catch (error) {
        console.log(
          "Error saving artwork details (firebase/cloudflare):",
          error
        );
        // Rollback: Delete the uploaded image from Firebase Storage
        await fileRef.delete();
        return res.status(500).json({ error: "Error uploading image backend" });
      }
    });
  } catch (error) {
    console.log("Error uploading image backend", error);
    return res.status(500).json({ error: "Error uploading image backend" });
  }
};

export default addImage;
