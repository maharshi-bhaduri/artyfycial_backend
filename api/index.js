import Router from "router";
import finalhandler from "finalhandler";
const getTime = require("./getTime");
const addImage = require("./addImage");
const getGallery = require("./getGallery");
const getFeed = require("./getFeed");
import { allowCors } from "../utils/utils";

const router = Router();
router.get("/api/getTime", getTime);
router.post("/api/addImage", addImage);
router.get("/api/getGallery", getGallery);
router.get("/api/getFeed", getFeed);

function getRoutes(req, res) {
  router(req, res, finalhandler(req, res));
}
export default allowCors(getRoutes);
