import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Decks from "./decks/Decks";
import Review from "./review/Review";
import NotFound from "../components/NotFound";
import GoogleAnalytics from "../components/GoogleAnalytics";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App d-flex flex-column justify-content-between text-left">
        <Header 
          onShareTwitter={() => GoogleAnalytics.logTwitterShare()}
          onShareFacebook={() => GoogleAnalytics.logFacebookShare()}/>
        <HashRouter>
          <div className="app">
            <Route path="/" component={GoogleAnalytics} />
            <Switch>
              <Route exact path="/" component={Decks} />
              <Route exact path="/categories/:categoryId" component={Decks} />
              <Route exact path="/decks" component={Decks} />
              <Route exact path="/decks/:deckId" component={Review} />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </div>
        </HashRouter>
        <Footer 
          onClickGithub={() => GoogleAnalytics.logGithubInterest}
          onClickDonate={() => GoogleAnalytics.logDonateEvent2}/>
      </div>
    );
  }
}

export default App;
