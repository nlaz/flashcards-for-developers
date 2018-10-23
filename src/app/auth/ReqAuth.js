import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import isAuthenticated from "../utils/isAuthenticated";

const ReqAuth = ComposedComponent => {
  class Authentication extends Component {
    render() {
      if (!isAuthenticated()) {
        return <Redirect to="/" />;
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  return Authentication;
};

export default ReqAuth;
