import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Decks from "./decks/Decks";
import Review from "./review/Review";
import Collections from "./collections/Collections";
import NotFound from "../components/NotFound";
import GoogleAnalytics, { logUserRedirect } from "../components/GoogleAnalytics";
import Footer from "../components/Footer";
import Header from "../components/Header";

const RedirectHeader = () => (
  <div
    style={{
      background: "#fff6d9",
      boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
      border: "1px solid #f9edca",
    }}
  >
    <div className="container d-flex flex-column flex-sm-row justify-content-center align-items-center p-2">
      <div>
        <span role="img" aria-label="emoji">
          🎉
        </span>{" "}
        <span className="m-0 font-weight-medium">We have a new version of our site.</span>
      </div>
      <a
        href="https://www.flashcardsfordevelopers.com"
        onClick={() => logUserRedirect}
        className="text-underline font-weight-medium ml-2"
      >
        Take me to it.
      </a>
    </div>
  </div>
);

class App extends Component {
  componentDidMount() {
    window.location = "https://www.flashcardsfordevelopers.com/";
  }

  render() {
    return (
      <HashRouter>
        <div className="App d-flex flex-column justify-content-between text-left">
          <RedirectHeader />
          <Header />
          <div style={{ flexGrow: 1 }}>
            <div>
              <Route path="/" component={GoogleAnalytics} />
              <Switch>
                <Route exact path="/" component={Decks} />
                <Route exact path="/categories/:categoryId" component={Decks} />
                <Route exact path="/decks" component={Decks} />
                <Route exact path="/decks/:deckId" component={Review} />
                <Route exact path="/collections/:collectionId" component={Collections} />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default App;
