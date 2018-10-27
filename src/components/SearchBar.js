import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import PropTypes from "prop-types";

import * as api from "../app/apiActions";

class SearchBar extends Component {
  state = {
    searchString: "",
    redirect: false,
    filteredNames: [],
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    this.fetchContent();
  }

  handleSearch = () => {
    this.setState({ isRedirect: true });
  };

  fetchContent = () => {
    api.fetchContent().then(({ data }) => {
      const filteredNames = data.map(content => content.name);
      this.setState({ content: data, isLoading: false, filteredNames });
    });
  };

  componentDidUpdate() {
    const { redirect } = this.state;
    if (redirect) {
      const isCollection = this.state.content.find(el => el.name === this.state.searchString);
      if (isCollection) {
        this.setState({ redirect: false });
        this.context.router.history.push("/collections/" + isCollection.id);
      }
    }
  }

  render() {
    const { isRedirect, search } = this.state;

    if (isRedirect) {
      return <Redirect to={`/collections/${search.id}`} />;
    }

    return (
      <div className="d-flex justify-content-center" onKeyPress={this.onKeyStroke} tabIndex="0">
        <Typeahead
          className="search-term border-primary"
          options={this.state.filteredNames}
          onChange={e => {
            this.setState({ searchString: e[0] });
          }}
          placeholder="Search..."
        />
        <button
          type="submit"
          className="search-button text-white bg-primary border-info"
          onClick={this.handleSearch}
        >
          <i className="fa fa-search" />
        </button>
      </div>
    );
  }
}

export default SearchBar;
