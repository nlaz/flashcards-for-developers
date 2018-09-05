import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Redirect } from "react-router";
import * as api from "../app/apiActions";

class SearchBar extends Component {
  state = {
    searchString: "",
    collections: [],
  };

  componentWillMount() {
    this.fetchCollectionList();
  }

  fetchCollectionList = () => {
    api.fetchAllCollections().then(collections => {
      this.setState({ collections: collections });
    });
  };

  handleSearch = () => {
    this.setState({ redirect: true });
  };

  onKeyStroke = e => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  };

  render() {
    if (this.state.redirect) {
      const isCollection = this.state.collections.find(el => el.name === this.state.searchString);
      if (isCollection) {
        return <Redirect push to={"/collections/" + isCollection.id} />;
      }
    }

    const filteredNames = this.state.collections.map(collection => collection.name);

    return (
      <form className="d-flex justify-content-center" onKeyPress={this.onKeyStroke} tabIndex="0">
        <Typeahead
          className=""
          options={filteredNames}
          onChange={e => {
            this.setState({ searchString: e[0] });
          }}
          placeholder="Search..."
        />
      </form>
    );
  }
}

export default SearchBar;
