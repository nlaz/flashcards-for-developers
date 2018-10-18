import React, { Component } from "react";
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from "react-stripe-elements";

import * as api from "../app/apiActions";

class CheckoutForm extends Component {
  state = { isLoading: false };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (this.props.stripe && !this.state.isLoading) {
      this.props.stripe.createToken().then(payload => this.onToken(payload.token));
    } else {
      this.setState({ isLoading: false });
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
      .then(this.props.onSuccess)
      .catch(this.props.onError);
  };

  render() {
    const { isLoading } = this.state;

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
        <hr />
        <button className="btn btn-primary btn-sm font-weight-medium py-2 w-100" type="submit">
          {isLoading && <i className="fas fa-spinner fa-spin mr-1" />}
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
