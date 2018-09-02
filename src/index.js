import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { unregister } from "./registerServiceWorker";

import "primer-markdown/build/build.css";
import "rc-tooltip/assets/bootstrap.css";

import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));
unregister();
