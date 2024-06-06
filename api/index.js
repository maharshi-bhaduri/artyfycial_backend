import Router from "router";
import finalhandler from "finalhandler";
import { allowCors } from "../utils/utils";
// const getMenu = require("../services/getMenu");

const router = Router();

// router.post("/api/create-provider", createProvider);
// router.get("/api/get-provider-details", getProviderDetails);

function getRoutes(req, res) {
  router(req, res, finalhandler(req, res));
}

export default allowCors(getRoutes);
z