import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import cookie from "js-cookie";

import About from "./About";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import Membership from "./Membership";
import MembershipNew from "./MembershipNew";
import NotFound from "../components/NotFound";

import "./Pages.css";

const CHAT_APP_ID = "uhq7cari";

class Pages extends Component {
  componentDidMount() {
    const user = JSON.parse(cookie.get("user"));
    window.Intercom("boot", {
      app_id: CHAT_APP_ID,
      name: user.name,
      email: user.email,
      user_plan: user.user_plan,
    });
  }

  render() {
    return (
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
          <Route exact path="/pages/membership" component={Membership} />
          <Route exact path="/pages/membership/new" component={MembershipNew} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default Pages;
