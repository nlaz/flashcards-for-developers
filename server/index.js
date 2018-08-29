const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const routes = require("./routes");
const paths = require("../config/paths");
const config = require("../config/index");

require("../database/index")();

const app = express();

app.use(express.static(paths.appBuild));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(passport.session());

app.use(morgan("tiny"));
app.use(routes);

app.get("/", function(req, res) {
  res.sendFile(paths.appEntry);
});

app.listen(config.port, () => {
  console.log(`✨ Starting the server on port ${config.port}`);
});
