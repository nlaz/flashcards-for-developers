import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import { unregister } from "./registerServiceWorker";
import "primer-markdown/build/build.css";

ReactDOM.render(<App />, document.getElementById("root"));
unregister();
