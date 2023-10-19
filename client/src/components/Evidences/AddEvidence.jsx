import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import EnumDropdown from "../EnumDropDown";
import { EvidenceClassification, EvidenceType, getEvidenceClassificationDescription, getEvidenceTypeDescription } from "../../enums/EvidenceEnums";

function AddEvidence(props) {
  const { show, onClose, drizzleContext } = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
    evidenceUniqueCode: "",
    evidenceCaseNo: "",
    evidenceName: "",
  });

  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      const contractInstance = drizzle.contracts.EvidenceChain;
      const methodArgs = [
        formData.evidenceUniqueCode,
        formData.evidenceCaseNo,
        selectedClassification,
        //formData.evidenceClassification,
        formData.evidenceName,
        selectedType
        //formData.evidenceType,
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
              placeholder="Unique ID"
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
              placeholder="NO.0000"
              value={formData.evidenceCaseNo}
              onChange={handleChange}
            />
          </Form.Group>

          <EnumDropdown title = {"Classification"} entityEnum = {EvidenceClassification}  onSelect={setSelectedClassification} enumDescription = {getEvidenceClassificationDescription}></EnumDropdown>
          
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

          <EnumDropdown title = {"Type"} entityEnum = {EvidenceType}  onSelect={setSelectedType} enumDescription = {getEvidenceTypeDescription}></EnumDropdown>
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
