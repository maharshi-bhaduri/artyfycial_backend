import Router from "router";
import finalhandler from "finalhandler";
const getTime = require("./getTime");
const createImage = require("./createImage");
const getGallery = require("./getGallery");
import { allowCors } from "../utils/utils";

const router = Router();
router.get("/api/getTime", getTime);
router.post("/api/createImage", createImage);
router.get("/api/getGallery", getGallery);

function getRoutes(req, res) {
  router(req, res, finalhandler(req, res));
}
export default allowCors(getRoutes);
