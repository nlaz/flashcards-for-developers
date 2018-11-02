import React from "react";
import Modal from "react-modal";

import Octicon from "../../components/Octicon";

const DeleteModal = ({ isOpen, onConfirm, onCancel }) => (
  <Modal isOpen={isOpen} className="loginModal modal--narrow" overlayClassName="loginModal-overlay">
    <div className="d-flex align-items-center justify-content-between px-3 py-2">
      <h1 className="m-0" style={{ fontSize: "1.125em" }}>
        Are you sure?
      </h1>
      <button className="btn btn-sm btn-reset p-2" onClick={onCancel}>
        <Octicon name="x" className="d-flex" />
      </button>
    </div>
    <hr className="m-0" />
    <div className="p-3 small">
      <p>
        <strong>
          Deleting your account will delete all of your cards and all of your study progress. This
          action is irreversible.
        </strong>{" "}
        Are you certain you want to delete it?
      </p>
    </div>
    <hr className="m-0" />
    <div className="d-flex align-items-center justify-content-end px-3 py-2">
      <button onClick={onCancel} className="btn btn-sm btn-secondary mr-2">
        Cancel
      </button>
      <button onClick={onConfirm} className="btn btn-sm btn-danger">
        Delete
      </button>
    </div>
  </Modal>
);
export default DeleteModal;
