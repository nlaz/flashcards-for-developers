import React from "react";

import * as api from "../apiActions";
import CollectionItem from "./CollectionItem";

class CollectionsHome extends React.Component {
  state = { collections: [] };

  componentDidMount() {
    this.fetchCollections();
  }

  fetchCollections = () => {
    api
      .fetchCollections()
      .then(response => this.setState({ collections: response.data }))
      .catch(this.handleError);
  };

  handleError = error => console.error(error);

  render() {
    const { collections } = this.state;
    return (
      <div className="container container--narrow px-4 my-5">
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
export default CollectionsHome;
