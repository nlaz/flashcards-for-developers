import React from "react";
import { Link } from "react-router-dom";

const CollectionItem = ({ collection }) => (
  <div className="collection-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex mb-3">
    <Link className="bg-dark text-light w-100 d-flex p-3" to={`/collections/${collection.id}`}>
      {collection.name}
    </Link>
  </div>
);

export default CollectionItem;
