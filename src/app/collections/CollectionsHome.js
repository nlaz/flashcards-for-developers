import React from "react";
import { Link } from "react-router-dom";

import * as api from "../apiActions";

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
          {collections.map(collection => (
            <div
              className="collection-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex mb-3"
              key={collection.id}
            >
              <Link
                className="bg-dark text-light w-100 d-flex p-3"
                to={`/collections/${collection.id}`}
              >
                {collection.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default CollectionsHome;
