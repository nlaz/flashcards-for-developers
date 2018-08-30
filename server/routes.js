const express = require("express");

const passport = require("./passport/index");
const UserController = require("./controllers/UserController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.get("/test", (req, res) => res.redirect("/hello"));

router.post("/auth/signup", UserController.signupUser);

router.post("/auth/login", passport.authenticate("local"), UserController.loginUser);

router.post("/auth/github", UserController.githubUser);

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
