import React, { Component } from "react";
import { Elements } from "react-stripe-elements";

import CheckoutForm from "./CheckoutForm";
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
                <span className="text-dark font-weight-bold">$6 per month</span>
              </div>
              <p className="deck-description font-weight-normal m-0">
                Your Pro subscription automatically renews every month and you can cancel any time.
              </p>
            </div>
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      </div>
    );
  }
}

export default MembershipNew;
