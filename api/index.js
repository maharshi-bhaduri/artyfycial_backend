import Router from "router";
import finalhandler from "finalhandler";
import getTime from "../services/getTime.js";
import addImage from "../services/addImage.js";
import getGallery from "../services/getGallery.js";
import getFeed from "../services/getFeed.js";
import getArtworkDetails from "../services/getArtworkDetails.js";
import deleteArtwork from "../services/deleteArtwork.js";
import updateArtwork from "../services/updateArtwork.js";
import getArtworkList from "../services/getArtworkList.js";
import getPortfolio from "../services/getPortfolio.js";
import getMarketPlace from "../services/getMarketPlace.js";
import getArtworkListNew from "../services/getArtworkListNew.js";
import addBidtoFirestore from "../services/addBidToFirestore.js";

import { allowCors } from "../utils/utils.js";

const router = Router();
router.get("/api/getTime", getTime);
router.post("/api/addImage", addImage);
router.get("/api/getGallery", getGallery);
router.get("/api/getFeed", getFeed);
router.post("/api/deleteArtwork", deleteArtwork);
router.get("/api/getArtworkDetails", getArtworkDetails);
router.post("/api/updateArtwork", updateArtwork);
router.get("/api/getArtworkList", getArtworkList);
router.get("/api/getPortfolio", getPortfolio);
router.get("/api/getMarketPlace", getMarketPlace);
router.post("/api/getArtworkListNew", getArtworkListNew);
router.post("/api/addBidstoFirestore", addBidtoFirestore);

function getRoutes(req, res) {
  console.log(`Received request: ${req.method} ${req.url}`);
  router(req, res, finalhandler(req, res));
}

export default allowCors(getRoutes);
// export default getRoutes;
