import React from "react";
import { Link } from "react-router-dom";

const CollectionItem = ({ collection }) => (
  <div className="collection-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex mb-3">
    <Link
      className="text-white rounded w-100 d-flex p-3 position-relative"
      to={`/collections/${collection.id}`}
    >
      {collection.name}
    </Link>
  </div>
);

CollectionItem.defaultProps = {
  collection: {},
};

export default CollectionItem;
