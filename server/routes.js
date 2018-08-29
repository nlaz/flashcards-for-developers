const express = require("express");

const router = express.Router();

router.get("/hello", (req, res) => {
  res.send({ message: "Hello world!" });
});

router.use((req, res) => {
  return res.status(404).send({
    url: req.originalUrl,
    error: "Not found",
  });
});

router.use((err, req, res, next) => {
  return res.status(500).send({ error: err.stack });
});

module.exports = router;
