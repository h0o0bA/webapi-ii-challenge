const express = require("express");

const server = express();

const router = express.Router();

server.use(express.json());

router.use("/", (req, res) => {
  res.status(200).send("Posts Path");
});

module.exports = router;
