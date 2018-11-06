const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const forceDomain = require("forcedomain");
const compression = require("compression");

const routes = require("./routes");
const paths = require("../config/paths");
const config = require("../config/index");

require("../database/index")();

const app = express();

app.use(compression());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(forceDomain({ hostname: config.hostname, protocol: "https" }));

app.get("/", function(req, res) {
  res.sendFile(paths.appEntry);
});

app.use(express.static(paths.appBuild));
app.use(routes);

app.use((req, res) => {
  res.sendFile(paths.appEntry);
});

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(400).send({ error: err.stack, message: "User already exists" });
  }
  return res.status(500).send({ error: err.stack });
});

app.listen(config.port, () => {
  console.log(`✨ Starting the server on port ${config.port}`);
});
