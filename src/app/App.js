import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Decks from "./decks/Decks";
import Review from "./review/Review";
import NotFound from "../components/NotFound";
import GoogleAnalytics from "../components/GoogleAnalytics";
import Footer from "../components/Footer";
import Header from "../components/Header";

class App extends Component {
  render() {
    return (
      <div className="App d-flex flex-column justify-content-between text-left">
        <Header />
        <div style={{ flexGrow: 1 }}>
          <BrowserRouter>
            <div>
              <Route path="/" component={GoogleAnalytics} />
              <Switch>
                <Route exact path="/" component={Decks} />
                <Route exact path="/categories/:categoryId" component={Decks} />
                <Route exact path="/decks" component={Decks} />
                <Route exact path="/decks/:deckId" component={Review} />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
