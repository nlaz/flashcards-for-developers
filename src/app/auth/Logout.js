import React from "react";
import cookie from "js-cookie";

class Logout extends React.Component {
  componentWillMount() {
    cookie.remove("token", { path: "/" });
    cookie.remove("user", { path: "/" });

    this.props.history.push("/");
  }

  render() {
    return false;
  }
}

export default Logout;
