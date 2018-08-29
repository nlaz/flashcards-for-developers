import React, { Component } from "react";
import * as api from "../apiActions";

class Signup extends Component {
  state = { username: "", password: "" };

  onChange = ({ target }) => this.setState({ [target.name]: target.value });

  onSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    api
      .signupUser({ username, password })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="container my-5 pt-5">
        <form onSubmit={this.onSubmit} className="col-4 offset-4">
          <h1>Signup</h1>
          <div className="form-group">
            <input
              onChange={this.onChange}
              className="form-control"
              name="username"
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <input
              onChange={this.onChange}
              className="form-control"
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Signup;
