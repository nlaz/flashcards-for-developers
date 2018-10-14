import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { unregister } from "./registerServiceWorker";
import config from "./config";
import mixpanel from "mixpanel-browser";
import MixpanelProvider from "react-mixpanel";

import "primer-markdown/build/build.css";
import "rc-tooltip/assets/bootstrap.css";

import "./index.css";

mixpanel.init(config.mixpanelAnalyticsKey);

ReactDOM.render(
  <MixpanelProvider mixpanel={mixpanel}>
    <App />
  </MixpanelProvider>,
  document.getElementById("root"),
);
unregister();
