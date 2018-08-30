import React, { Component } from "react";
import queryString from "query-string";
import axios from "axios";

class AuthRedirect extends Component {
  state = { user: {} };
  componentDidMount() {
    const { location } = this.props;
    if (location.search) {
      const { code } = queryString.parse(location.search);

      axios
        .post("/auth/github", { code })
        .then(response => this.setState({ user: response.data }))
        .catch(error => console.log(error));
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    const { user } = this.state;
    if (Object.keys(user).length === 0) {
      return (
        <div className="container my-5 pt-5">
          <i className="fas fa-spinner fa-spin mr-1" />Loading profile...
        </div>
      );
    }

    return (
      <div className="container my-5 pt-5">
        <img src={user.avatar_url} alt="" />
        <div className="mb-2">
          <span className="font-weight-bold">Name:</span> {user.name}
        </div>
        <div className="mb-2">
          <span className="font-weight-bold">Email:</span> {user.email}
        </div>
      </div>
    );
  }
}

export default AuthRedirect;
