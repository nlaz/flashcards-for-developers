import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Redirect } from 'react-router';

class SearchBar extends Component {
    state = {
      searchString: '',
    };

    handleSearch = () => {
      this.setState({redirect: true});
    }

    onKeyStroke = (e) => {
      if (e.key === 'Enter') {
      this.handleSearch();
      }
    }

    render() {
      if (this.state.redirect) {
          const isCollection = 
            this.props.collections.find(el => el.name === this.state.searchString);
          if (isCollection) {
            return <Redirect push to={"/collections/"+ isCollection.id} />;
          }
      }

      const filteredNames =
        this.props.collections.map( collection =>
          collection.name
      );

    return (
        <div 
          className="d-flex justify-content-center" 
          onKeyPress={this.onKeyStroke}
          tabIndex="0">
          <Typeahead
              className="search-term border-primary"
              options={filteredNames}
              onChange={(e) => {
                  this.setState({searchString: e[0]});
              }}
              placeholder="Search..."
          />
          <button type="submit" className="search-button text-white bg-primary border-info" onClick={this.handleSearch}>
              <i className="fa fa-search"></i>
          </button>
        </div>
        );
    }
}

export default SearchBar;