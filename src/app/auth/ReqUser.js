import React, { Component } from "react";

import * as api from "../apiActions";

const ReqUser = ComposedComponent => {
  class FetchUser extends Component {
    state = { user: {} };

    componentDidMount() {
      const { username } = this.props.match.params;
      this.fetchUserProfile(username);
    }

    fetchUserProfile = username => {
      api.fetchUserProfile(username).then(({ data }) => this.setState({ user: data }));
    };

    render() {
      const { user } = this.state;
      return <ComposedComponent {...this.props} profile={user} />;
    }
  }

  return FetchUser;
};

export default ReqUser;
