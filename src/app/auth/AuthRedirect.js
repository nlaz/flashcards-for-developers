import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import cookie from "js-cookie";

import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import SignupFormModal from "./SignupFormModal";

class AuthRedirect extends Component {
  state = { user: {}, profile: {}, showModal: false };

  componentDidMount() {
    const { location } = this.props;
    if (location.search) {
      const { code } = queryString.parse(location.search);
      this.fetchUser(code);
    } else {
      this.setState({ isRedirect: true });
    }
  }

  fetchUser = code => {
    api.loginGithubUser(code).then(
      response => {
        analytics.logLoginAction("User logged in");
        const token = response.headers.authorization.split(" ")[1];
        cookie.set("token", token);
        cookie.set("user", response.data);
        this.setState({ user: response.data });
      },
      error => {
        if (error.response.status === 403) {
          const { profile } = error.response.data;
          this.setState({ profile, showModal: true });
        } else {
          this.setState({ isRedirect: true });
        }
      },
    );
  };

  onCloseModal = () => {
    analytics.logLoginAction("User exited sign up modal");
    this.setState({ isRedirect: true, showModal: false });
  };

  render() {
    const { user, profile, isRedirect, showModal } = this.state;

    if (showModal) {
      return <SignupFormModal profile={profile} onClose={this.onCloseModal} />;
    }

    if (!isRedirect && Object.keys(user).length === 0) {
      return (
        <div className="container my-5">
          <i className="fas fa-spinner fa-spin mr-1" />
          Loading profile...
        </div>
      );
    }

    return <Redirect to="/" />;
  }
}

AuthRedirect.defaultProps = {
  location: {},
};

export default AuthRedirect;
