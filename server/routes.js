const express = require("express");
const UserController = require("./controllers/UserController");
const passport = require("./passport/index");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.post("/users/signup", UserController.signupUser);
router.post("/users/login", passport.authenticate("local"), UserController.loginUser);

router.use((req, res) => {
  return res.status(404).send({
    url: req.originalUrl,
    error: "Not found",
  });
});

router.use((err, req, res, next) => {
  console.log("❌", err.message);
  return res.status(500).send({ error: err.stack });
});

module.exports = router;
