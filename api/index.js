import Router from "router";
import finalhandler from "finalhandler";
import getTime from "../services/getTime.js";
import addImage from "../services/addImage.js";
import getGallery from "../services/getGallery.js";
import getFeed from "../services/getFeed.js";
import { allowCors } from "../utils/utils.js";


const router = Router();
router.get("/api/getTime", getTime);
router.post("/api/addImage", addImage);
router.get("/api/getGallery", getGallery);
router.get("/api/getFeed", getFeed);

function getRoutes(req, res) {
  router(req, res, finalhandler(req, res));
}

export default allowCors(getRoutes);
