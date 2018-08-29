const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  dotenv: resolveApp(".env"),
  appBuild: resolveApp("build"),
  appEntry: resolveApp("build/index.html"),
};
