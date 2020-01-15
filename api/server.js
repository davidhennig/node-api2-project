const express = require("express");

const cors = require("cors");

const router = require("../router");

const server = express();

server.use(express.json());
server.use(cors());
server.get("/", (req, res) => {
  res.send("hello from server");
});

server.use("/api/posts", router);

module.exports = server;
