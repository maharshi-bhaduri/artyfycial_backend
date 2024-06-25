import { resUtil, verifyAuth, allowCors } from "../utils/utils.js";

const getTime = function (req, res) {
  res.end(JSON.stringify({ time: Date.now() }));
};

export default allowCors(getTime);