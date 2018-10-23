import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Pages from "../pages/Pages";
import Home from "./home/Home";
import Review from "./review/Review";
import DecksNew from "./decks/DecksNew";
import MyDecksHome from "./decks/MyDecksHome";
import CollectionsHome from "./collections/CollectionsHome";
import Collections from "./collections/Collections";
import Logout from "./auth/Logout";
import AuthRedirect from "./auth/AuthRedirect";
import Footer from "./Footer";
import Header from "./Header";

import NotFound from "../components/NotFound";
import GoogleAnalytics from "../components/GoogleAnalytics";
import ScrollToTop from "../components/ScrollToTop";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App d-flex flex-column justify-content-between text-left">
          <Header />
          <div style={{ flexGrow: 1 }}>
            <div>
              <Route path="/" component={GoogleAnalytics} />
              <Route path="/" component={ScrollToTop} />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/pages" component={Pages} />
                <Route path="/logout" component={Logout} />
                <Route path="/auth/github" component={AuthRedirect} />
                <Route exact path="/decks/new" component={DecksNew} />
                <Route exact path="/decks/:deckId" component={Review} />
                <Route exact path="/decks/:deckId/:tabName" component={Review} />
                <Route exact path="/collections" component={CollectionsHome} />
                <Route exact path="/collections/:collectionId" component={Collections} />
                <Route exact path="/collections/:collectionId/review" component={Review} />
                <Route exact path="/:userId/decks" component={MyDecksHome} />
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
