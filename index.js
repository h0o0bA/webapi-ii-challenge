const express = require("express");

const port = 8000;

const server = express();

server.use("/", (req, res) => {
  res.status(200).send("Web API II - Posts Challenge");
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
