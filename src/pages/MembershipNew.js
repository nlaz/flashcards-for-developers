import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Elements } from "react-stripe-elements";
import cookie from "js-cookie";

import CheckoutForm from "./CheckoutForm";
import Octicon from "../components/Octicon";

const STATUS = { SUCCESS: "✅", ERROR: "❌" };

class MembershipNew extends Component {
  state = { status: undefined };

  handleSuccess = response => {
    const { user } = response.data;
    this.setState({ status: STATUS.SUCCESS });
    cookie.set("user", user);
  };

  handleError = () => this.setState({ status: STATUS.ERROR });

  render() {
    const { status } = this.state;

    if (status === STATUS.SUCCESS) {
      return (
        <div className="bg-light d-flex flex-column" style={{ minHeight: "90vh" }}>
          <div className="container container--narrow py-5">
            <div className="row">
              <div className="col-md-6 offset-md-3 col-lg-8 offset-lg-2">
                <div
                  className="bg-white border rounded"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0, .05)" }}
                >
                  <div
                    className="p-3 rounded-top text-center"
                    style={{ background: "antiquewhite" }}
                  >
                    <span style={{ fontSize: "90px" }} role="img" aria-label="emoji">
                      🏅
                    </span>
                  </div>
                  <div className="py-5 px-4 mb-4 mx-auto" style={{ maxWidth: "430px" }}>
                    <div className="text-center mx-auto">
                      <h1 className="mr-2">
                        <span role="img" aria-label="emoji" className="mr-2">
                          ✅
                        </span>
                        Success!
                      </h1>
                      <p className="description font-weight-normal">
                        Thank you for becoming a Pro member. Enjoy unlimited access to all the
                        flashcards and topics you love.
                      </p>
                      <Link className="btn btn-dark" to="/">
                        <small className="d-flex">Start studying</small>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container container--narrow py-5">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="mb-4 border rounded p-3 text-center">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ fontSize: "1.15em" }}
              >
                <span className="text-primary font-weight-bold">Pro</span>
                <Octicon name="primitive-dot" width="12px" height="12px" className="mx-1" />
                <span className="text-dark font-weight-bold">$6 per month</span>
              </div>
              <p className="deck-description font-weight-normal m-0">
                Your Pro subscription automatically renews every month and you can cancel any time.
              </p>
            </div>
            <Elements>
              <CheckoutForm onSuccess={this.handleSuccess} onError={this.handleError} />
            </Elements>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MembershipNew);
