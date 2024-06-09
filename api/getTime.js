import { resUtil, verifyAuth, allowCors } from "../utils/utils";

const getTime = function (req, res) {
  //console.log(req.header.origin);
  res.end(JSON.stringify({ time: Date.now() }));
};

module.exports = allowCors(verifyAuth(getTime));
