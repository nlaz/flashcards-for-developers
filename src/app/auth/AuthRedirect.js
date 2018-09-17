import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import cookie from "js-cookie";

import * as api from "../apiActions";

class AuthRedirect extends Component {
  state = { user: {} };

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
    api.githubUser(code).then(
      response => {
        const token = response.headers.authorization.split(" ")[1];
        cookie.set("token", token);
        cookie.set("user", response.data);
        this.setState({ user: response.data });
      },
      error => {
        console.log(error);
        this.setState({ isRedirect: true });
      },
    );
  };

  render() {
    const { user, isRedirect } = this.state;
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
