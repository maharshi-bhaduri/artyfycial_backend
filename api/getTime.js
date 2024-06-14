import { resUtil, verifyAuth, allowCors } from "../utils/utils";

const getTime = function (req, res) {
  res.end(JSON.stringify({ time: Date.now() }));
};

module.exports = allowCors(verifyAuth(getTime));
