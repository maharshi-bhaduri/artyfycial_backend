import Router from "router";
import finalhandler from "finalhandler";
const getTime = require("./getTime");
const createImage = require("./createImage");
import { allowCors } from "../utils/utils";

const router = Router();
router.get("/api/getTime", getTime);
router.post("/api/createImage", createImage);

function getRoutes(req, res) {
  router(req, res, finalhandler(req, res));
}
export default allowCors(getRoutes);
