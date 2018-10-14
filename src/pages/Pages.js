import React from "react";
import { Route, Switch } from "react-router-dom";

import About from "./About";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import Membership from "./Membership";
import NotFound from "../components/NotFound";

import "./Pages.css";

const Pages = () => (
  <div className="pages">
    <div className="pages-header">
      <span className="pages-hero" role="img" aria-label="Tada!">
        🎉
      </span>
    </div>
    <Switch>
      <Route path="/pages/about" component={About} />
      <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
      <Route path="/pages/terms-of-service" component={TermsOfService} />
      <Route path="/pages/membership" component={Membership} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  </div>
);

export default Pages;
