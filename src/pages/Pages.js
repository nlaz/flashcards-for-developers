import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivacyPolicy from "./PrivacyPolicy";
import NotFound from "../components/NotFound";

import "./Pages.css";

const About = () => <h1>About</h1>;

const TermsOfService = () => <h1>Terms of Service</h1>;

const Pages = () => (
  <div className="pages">
    <Switch>
      <Route path="/pages/about" component={About} />
      <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
      <Route path="/pages/terms-of-service" component={TermsOfService} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  </div>
);

export default Pages;
