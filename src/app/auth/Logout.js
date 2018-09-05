import React from "react";
import cookie from "js-cookie";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  componentWillMount() {
    cookie.remove("token");
    cookie.remove("user");
  }

  render() {
    return <Redirect to="/" />;
  }
}

export default Logout;
