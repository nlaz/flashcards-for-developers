import React, { Component } from "react";
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from "react-stripe-elements";

import * as api from "../app/apiActions";

class CheckoutForm extends Component {
  state = { isLoading: false, errors: { form: "", cardNumber: "", cardExpiry: "", cardCvc: "" } };

  onSubmit = e => {
    e.preventDefault();

    if (this.props.stripe) {
      this.createStripeToken();
    } else {
      return console.log("Stripe.js hasn't loaded yet.");
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
      .catch(this.handleError);
  };

  onChange = field => {
    const { errors } = this.state;
    this.setState({ errors: { ...errors, [field.elementType]: (field.error || {}).message } });
  };

  createStripeToken = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });

      this.props.stripe
        .createToken()
        .then(payload => this.onToken(payload.token))
        .catch(this.handleError);
    }
  };

  handleSuccess = response => {
    this.setState({ isLoading: false, errors: { forms: "" } });
    this.props.onSuccess(response);
  };

  handleError = error => {
    this.setState({ errors: { ...this.state.errors, form: error.message }, isLoading: false });
  };

  render() {
    const { errors, isLoading } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="pb-4">
        {errors.form && (
          <div className="alert alert-danger">
            We cannot complete the transaction.{" "}
            <a
              className="alert-link font-weight-normal text-underline"
              href="mailto:hello@flashcardsfordevelopers.com"
            >
              Contact us
            </a>
            .
          </div>
        )}
        <div className="d-flex justify-content-between mt-3">
          <span>Pro Subscription</span>
          <span>$6</span>
        </div>
        <hr className="mb-4 mt-0" style={{ borderStyle: "dotted" }} />
        <div className="form-group mb-2" style={{ opacity: isLoading ? 0.6 : 1 }}>
          <div className="d-flex justify-content-between align-items-center">
            <label className="small font-weight-bold mb-1">Card number</label>
            {errors.cardNumber && (
              <small className="text-danger ml-2 mb-1 shake--error">{errors.cardNumber}</small>
            )}
          </div>
          <CardNumberElement onChange={this.onChange} className="form-control py-2" />
        </div>
        <div className="form-group mb-2" style={{ opacity: isLoading ? 0.6 : 1 }}>
          <div className="d-flex justify-content-between align-items-center">
            <label className="small font-weight-bold mb-1">Expiration date</label>
            {errors.cardExpiry && (
              <small className="text-danger ml-2 mb-1 shake--error">{errors.cardExpiry}</small>
            )}
          </div>
          <CardExpiryElement onChange={this.onChange} className="form-control py-2" />
        </div>
        <div className="form-group mb-2" style={{ opacity: isLoading ? 0.6 : 1 }}>
          <div className="d-flex justify-content-between align-items-center">
            <label className="small font-weight-bold mb-1">Security code</label>
            {errors.cardCvc && (
              <small className="text-danger ml-2 mb-1 shake--error">{errors.cardCvc}</small>
            )}
          </div>
          <CardCVCElement onChange={this.onChange} className="form-control py-2" />
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
