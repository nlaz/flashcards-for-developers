import React, { Component } from "react";
import Octicon from "../components/Octicon";

class MembershipNew extends Component {
  render() {
    return (
      <div className="container container--narrow py-5">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="mb-5 border rounded p-3 text-center">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ fontSize: "1.15em" }}
              >
                <span className="text-primary font-weight-bold">Pro</span>
                <Octicon name="primitive-dot" width="12px" height="12px" className="mx-1" />
                <span className="text-dark font-weight-bold">$6 per year</span>
              </div>
              <p className="deck-description font-weight-normal m-0">
                Your Pro subscription automatically renews every month and you can cancel any time.
              </p>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="d-flex justify-content-between">
                <span>Pro Subscription</span>
                <span>$6</span>
              </div>
              <hr className="mb-4 mt-0" style={{ borderStyle: "dotted" }} />
              <div class="form-group mb-3">
                <label className="small font-weight-bold mb-1">Card Number</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  onChange={this.onChange}
                />
              </div>
              <div class="form-group mb-4">
                <label className="small font-weight-bold mb-1">Expiration</label>
                <input type="text" name="name" className="form-control" onChange={this.onChange} />
              </div>
              <button
                className="btn btn-primary btn-sm font-weight-medium py-2 w-100"
                type="submit"
              >
                Purchase Pro
              </button>
              <div className="mt-2 text-center">
                <small className="text-muted">
                  Questions? <a href="mailto:hello@flashcardsfordevelopers.com">Contact us</a>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default MembershipNew;
