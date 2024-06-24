import * as admin from "firebase-admin";
import * as formidable from "formidable-serverless";
import * as fs from "fs";
import * as util from "util";
import { allowCors } from "../utils/utils"; // Adjust the path as needed
import axios from "axios";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.storageBucket,
});

const storage = admin.storage();
const bucket = storage.bucket();

const createImage = async function (req, res) {
  try {
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

      const filePath = `images/${imageFile.name}`;

      const fileRef = bucket.file(filePath);

      try {
        // Upload file to Firebase Storage
        await fileRef.save(fileBuffer, {
          metadata: { contentType: imageFile.type },
        });

        // Get the public URL of the uploaded file
        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        console.log("File is available at", downloadURL);
        //axios post call
        await axios.post(process.env.CF_ADD_ARTWORK_DATA, data, {
          "Content-Type": "application/json",
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

module.exports = allowCors(createImage);
