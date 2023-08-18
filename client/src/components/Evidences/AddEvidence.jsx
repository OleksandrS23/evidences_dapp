import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function AddEvidence(props) {
  const { show, onClose, drizzleContext } = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
    evidenceUniqueCode: "",
    evidenceCaseNo: "",
    evidenceClassification: "",
    evidenceName: "",
    evidenceType: "",
  });
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      const contractInstance = drizzle.contracts.EvidenceChain;
      const methodArgs = [
        formData.evidenceUniqueCode,
        formData.evidenceCaseNo,
        formData.evidenceClassification,
        formData.evidenceName,
        formData.evidenceType,
      ];
      const stackId = contractInstance.methods.addEvidence.cacheSend(
        ...methodArgs
      );
      setFormData({});
      setValidated(false);
      onClose();
    } else {
      setValidated(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Evidence</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mt-1" controlId="evidence.evidenceUniqueCode">
            <Form.Label>ID</Form.Label>
            <Form.Control
              required
              type="text"
              name="evidenceUniqueCode"
              placeholder="EvidenceId1"
              value={formData.evidenceUniqueCode}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-1" controlId="evidence.evidenceCaseNo">
            <Form.Label>Case No</Form.Label>
            <Form.Control
              required
              type="text"
              name="evidenceCaseNo"
              placeholder="123456"
              value={formData.evidenceCaseNo}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-1" controlId="evidence.evidenceClassification">
            <Form.Label>Classification</Form.Label>
            <Form.Control
              required
              type="text"
              name="evidenceClassification"
              placeholder="Normal"
              value={formData.evidenceClassification}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-1" controlId="evidence.evidenceName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              name="evidenceName"
              placeholder="Evidence Name"
              value={formData.evidenceName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-1 mb-3" controlId="evidence.evidenceType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              required
              type="text"
              name="evidenceType"
              placeholder="File"
              value={formData.evidenceType}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
          <Button style={{ marginRight: '10px' }} variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button  variant="primary" type="submit">
            Submit
          </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddEvidence;
