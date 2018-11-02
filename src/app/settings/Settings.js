import React, { Component } from "react";
import cookie from "js-cookie";

import isAuthenticated from "../utils/isAuthenticated";

class Settings extends Component {
  render() {
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};

    return (
      <div className="container container--full my-5 px-4">
        <h1 className="mb-4">Settings</h1>
        <div className="border bg-white rounded px-3 py-4">
          <h5 className="font-weight-light py-1">My Details</h5>
          <hr />
          <div className="row mt-5">
            <div className="col-1">
              <small className="text-muted">Name</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.name} />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Avatar</small>
            </div>
            <div className="col-11">
              <img
                className="rounded rounded-circle"
                style={{ width: "60px", height: "60px" }}
                src={user.avatar_url}
                alt={user.name}
              />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Email</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.email} />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Username</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.username} />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Newsletter</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.email_notification} />
              <hr />
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-sm  mt-3">Update</button>
      </div>
    );
  }
}

export default Settings;
