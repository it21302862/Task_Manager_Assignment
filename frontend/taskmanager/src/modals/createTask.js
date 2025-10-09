import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const CreateTaskPopup = ({ modal, toggle,save}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: "", description: "" });

  useEffect(() => {
    if (modal) {
      setTitle("");
      setDescription("");
      setErrors({ title: "", description: "" });
    }
  }, [modal]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setTitle(value);
      if (value && errors.title) setErrors(prev => ({ ...prev, title: "" }));
    } else {
      setDescription(value);
      if (value && errors.description) setErrors(prev => ({ ...prev, description: "" }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const nextErrors = {
      title: title.trim() ? "" : "Title is required",
      description: description.trim() ? "" : "Description is required",
    };
    setErrors(nextErrors);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;
    save({ title: title.trim(), description: description.trim() });
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Task</ModalHeader>
      <ModalBody>
        <form>
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              className="form-control pretty-input"
              placeholder="Title"
              value={title}
              onChange={handleChange}
              name="title"
            />
            {errors.title ? (
              <div style={{
                marginTop: "8px",
                backgroundColor: "#f5636fff",
                color: "#ffffff",
                padding: "8px 10px",
                borderRadius: "6px"
              }}>
                {errors.title}
              </div>
            ) : null}
          </div>
          <div className="form-group mt-3">
            <label>Description</label>
            <textarea
              rows="5"
              className="form-control pretty-input"
              placeholder="Description"
              value={description}
              onChange={handleChange}
              name="description"
            ></textarea>
            {errors.description ? (
              <div style={{
                marginTop: "8px",
                backgroundColor: "#f5636fff",
                color: "#ffffff",
                padding: "8px 10px",
                borderRadius: "6px"
              }}>
                {errors.description}
              </div>
            ) : null}
          </div>
          <div className="form-group"></div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Create
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateTaskPopup;
