import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as api from "./apiActions";

class Categories extends Component {
  state = { categories: {} };

  componentWillMount() {
    this.fetchCategories();
  }

  fetchCategories() {
    api.fetchCategories().then(response => {
      this.setState({ categories: response });
    });
  }

  render() {
    const { categories } = this.state;
    return (
      <div className="container p-4 bg-light">
        <div>
          <h1>Categories</h1>
        </div>
        <div className="row">
          {Object.keys(categories).map((id, key) => (
            <div className="col-3 d-flex" key={key}>
              <Link to={id} className="bg-dark text-light mb-4 p-4 w-100">
                {categories[id]}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Categories;
