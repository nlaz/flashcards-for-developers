const express = require("express");

const router = express.Router();

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
