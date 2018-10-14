import React from "react";
import { Link } from "react-router-dom";

const CollectionItem = ({ collection }) => (
  <div className="collection-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex mb-3">
    <Link
      className="item-link bg-white text-center rounded w-100 d-flex flex-column p-3 position-relative"
      to={`/collections/${collection.id}`}
    >
      <div className="collection-image mb-2" style={{ background: collection.color }}>
        <span style={{ width: "22px" }}>{collection.emoji}</span>
      </div>
      <h6 className="font-weight-medium text-dark m-1">{collection.name}</h6>
      <span className="text-secondary">{collection.description}</span>
    </Link>
  </div>
);

CollectionItem.defaultProps = {
  collection: {},
};

export default CollectionItem;
