import React from "react";
import PropTypes from "prop-types";
import * as api from "../apiActions";
import CollectionItem from "./CollectionItem";

class CollectionsHome extends React.Component {
  state = { collections: [] };

  componentDidMount() {
    this.context.mixpanel.track("Collections Page.");
    this.fetchCollections();
  }

  sortCollections = (collections = []) => [...collections].sort((a, b) => a.order - b.order);
  fetchCollections = () => {
    api
      .fetchCollections()
      .then(({ data }) => this.setState({ collections: this.sortCollections(data) }))
      .catch(this.handleError);
  };

  handleError = error => console.error(error);

  render() {
    const { collections } = this.state;
    return (
      <div className="container container--full px-4 my-5">
        <h1 className="m-0 mb-3">Collections</h1>
        <div className="row">
          {collections.map(item => (
            <CollectionItem key={item.id} collection={item} />
          ))}
        </div>
      </div>
    );
  }
}

CollectionsHome.contextTypes = {
  mixpanel: PropTypes.object.isRequired,
};
export default CollectionsHome;
