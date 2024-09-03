import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  db,
} from "../utils/utils.js";

const addBidtoFirestore = async function (req, res) {
  try {
    // Extract marketplaceItemId and bidData from the request body
    const { marketplaceItemId, bidData, highestBid } = req.body;
    if (!marketplaceItemId || !bidData) {
      return res
        .status(400)
        .json({ error: "marketplaceItemId and bidData are required" });
    } // Reference the item document in Firestore
    console.log(bidData, highestBid);
    if (bidData.bidAmount <= highestBid) {
      console.log(
        "Bid amount cannot be lesser than or equal to the existing bid amount"
      );
      return res.status(400).json({
        error:
          "Bid amount cannot be lesser than or equal to the existing bid amount",
      });
    }
    const itemRef = doc(db, "items", marketplaceItemId.toString()); // Add the new bid to the bids sub-collection with a server timestamp

    await addDoc(collection(itemRef, "bids"), {
      ...bidData,
      bidTime: serverTimestamp(),
    });

    console.log(
      `Bid ${JSON.stringify(bidData)} added successfully to Firestore`
    ); // Send a success response

    res.status(200).json({ message: "Bid added successfully to Firestore" });
  } catch (error) {
    console.log("Error adding bid to Firestore", error); // Send an error response

    res.status(500).json({ error: "Error adding bid to Firestore" });
  }
};

export default addBidtoFirestore;
