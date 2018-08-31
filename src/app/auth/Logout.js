import React from "react";
import cookie from "js-cookie";

class Logout extends React.Component {
  componentWillMount() {
    cookie.remove("token");
    cookie.remove("user");

    this.props.history.push("/");
  }

  render() {
    return false;
  }
}

export default Logout;
