import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as api from "./apiActions";

class Categories extends Component {
  state = { categories: [] };

  componentWillMount() {
    this.fetchCategories();
  }

  fetchCategories() {
    api.fetchCategories().then(response => {
      this.setState({ categories: response });
    });
  }

  getCategoryUrl = id => `/categories/${id}`;

  render() {
    const { categories } = this.state;

    return (
      <div className="container p-4">
        <div className="mb-5">
          <h1 className="m-0">Flashcards for Developers</h1>
          <p>A curated list of flashcards to boost your professional skills</p>
        </div>
        <div className="row mt-5 pt-5">
          {categories.map(category => (
            <div
              className="col-3 d-flex px-2"
              key={category.id}
              style={{
                width: "400px",
                height: "225px",
              }}
            >
              <Link
                to={this.getCategoryUrl(category.id)}
                className="bg-dark text-white mb-4 p-3 w-100 d-flex align-items-end"
                style={{
                  fontSize: "14px",
                  opacity: category.decks ? 1 : 0.65,
                }}
              >
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Categories;
