import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Categories from "./Categories";
import Decks from "./Decks";
import Review from "./Review";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="mt-5">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Categories} />
            <Route exact path="/:categoryId" component={Decks} />
            <Route path="/decks/:deckId" component={Review} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
