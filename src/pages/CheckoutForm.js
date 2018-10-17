import React, { Component } from "react";
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
} from "react-stripe-elements";

import * as api from "../app/apiActions";

class CheckoutForm extends Component {
  onSubmit = e => {
    e.preventDefault();
    if (this.props.stripe) {
      this.props.stripe.createToken().then(payload => this.onToken(payload.token));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  onToken = token => {
    api
      .submitPayment({
        description: "Pro Subscription",
        amount: 6 * 100,
        currency: "USD",
        source: token.id,
      })
      .then(this.handleSuccess)
      .catch(this.handleError);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className="pb-4">
        <div className="d-flex justify-content-between">
          <span>Pro Subscription</span>
          <span>$6</span>
        </div>
        <hr className="mb-4 mt-0" style={{ borderStyle: "dotted" }} />
        <div className="form-group mb-2">
          <label className="small font-weight-bold mb-1">Card number</label>
          <CardNumberElement className="form-control py-2" />
        </div>
        <div className="form-group mb-2">
          <label className="small font-weight-bold mb-1">Expiration date</label>
          <CardExpiryElement className="form-control py-2" />
        </div>
        <div className="form-group mb-2">
          <label className="small font-weight-bold mb-1">Security code</label>
          <CardCVCElement className="form-control py-2" />
        </div>
        <div className="form-group mb-4">
          <label className="small font-weight-bold mb-1">Postal code</label>
          <PostalCodeElement className="form-control py-2" />
        </div>
        <hr />
        <button className="btn btn-primary btn-sm font-weight-medium py-2 w-100" type="submit">
          Purchase Pro
        </button>
        <div className="mt-2 text-center">
          <small className="text-muted">
            Questions? <a href="mailto:hello@flashcardsfordevelopers.com">Contact us</a>
          </small>
        </div>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
