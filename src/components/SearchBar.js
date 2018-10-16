import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
// import { Redirect } from 'react-router';
import PropTypes from 'prop-types'

class SearchBar extends Component {
    state = {
      searchString: '',
      redirect: false,
      filteredNames: []
    };

    static contextTypes = {
      router: PropTypes.object
    }

    handleSearch = () => {
      this.setState({redirect: true});
      // const isCollection = 
      //   this.props.content.find(el => el.name === this.state.searchString);
      // if (isCollection) {
      //   console.log("This Should Redirect at this Point");
      //   this.context.router.history.push("/collections/" + isCollection.id);
      // }
    }

    onKeyStroke = (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    }

    componentWillMount() {
        const filteredNames =
          this.props.content.map( content =>
            content.name
          );
        this.setState({filteredNames: filteredNames});
    }

    componentDidUpdate(){
      const { redirect } = this.state;
      if (redirect) {
          const isCollection = 
            this.props.content.find(el => el.name === this.state.searchString);
          if (isCollection) {
            console.log("This Should Redirect at this Point");
            this.setState({redirect: false});
            this.context.router.history.push("/collections/" + isCollection.id);
            // return <Redirect push to={"/collections/"+ isCollection.id} />;
          }
      }
    }
    render() {
      

    return (
        <div 
          className="d-flex justify-content-center" 
          onKeyPress={this.onKeyStroke}
          tabIndex="0">
          <Typeahead
              className="search-term border-primary"
              options={this.state.filteredNames}
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