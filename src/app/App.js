import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Pages from "../pages/Pages";
import Decks from "./decks/Decks";
import Review from "./review/Review";
import CollectionsHome from "./collections/CollectionsHome";
import Collections from "./collections/Collections";
import Logout from "./auth/Logout";
import AuthRedirect from "./auth/AuthRedirect";

import NotFound from "../components/NotFound";
import GoogleAnalytics from "../components/GoogleAnalytics";
import Footer from "../components/Footer";
import Header from "../components/Header";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App d-flex flex-column justify-content-between text-left">
          <Header />
          <div style={{ flexGrow: 1 }}>
            <div>
              <Route path="/" component={GoogleAnalytics} />
              <Switch>
                <Route exact path="/" component={Decks} />
                <Route path="/logout" component={Logout} />
                <Route path="/auth/github" component={AuthRedirect} />
                <Route path="/pages" component={Pages} />
                <Route exact path="/decks" component={Decks} />
                <Route exact path="/decks/:deckId" component={Review} />
                <Route exact path="/collections" component={CollectionsHome} />
                <Route exact path="/collections/:collectionId" component={Collections} />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
