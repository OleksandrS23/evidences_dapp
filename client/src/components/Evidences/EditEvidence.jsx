import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { EvidenceClassification, EvidenceType, getEvidenceClassificationDescription, getEvidenceTypeDescription } from "../../enums/EvidenceEnums";
import EnumDropdown from '../EnumDropDown';

function EditEvidence(props) {
  const { show, onClose , drizzleContext, data} = props
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
        evidenceUniqueCode: data?.uniqueCode, 
        evidenceCaseNo: data?.caseNo,
        evidenceClassification : data?.classification,
        evidenceName: data?.name, 
        evidenceType: data?.eType});

  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

   useEffect(() => {
            if (data) {
              setFormData({
                evidenceUniqueCode: data.uniqueCode,
                evidenceCaseNo: data.caseNo,
                evidenceName: data.name
              });
            }
          }, [data])


  const handleSubmit = (event) => {
    event.preventDefault();
    
    const contractInstance = drizzle.contracts.EvidenceChain;
    const methodArgs = [formData.evidenceUniqueCode, formData.evidenceCaseNo, selectedClassification, formData.evidenceName, selectedType];
    console.log(methodArgs)
    const stackId = contractInstance.methods.addEvidence.cacheSend(...methodArgs)
    setFormData({});
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
    if (!data){}
    else{
        return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Evidence: {formData.evidenceUniqueCode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          {/* <Form.Group className="mt-1" controlId="evidence.evidenceClassification">
            <Form.Label>Classification</Form.Label>
            <Form.Control
              required
              type="text"
              name="evidenceClassification"
              placeholder="Normal"
              value={formData.evidenceClassification}
              onChange={handleChange}
            /> 
          </Form.Group>*/}
      <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-1" controlId="evidence.evidenceName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name= "evidenceName"
              placeholder="Evidence Name"
              value={formData.evidenceName}
              onChange={handleChange}
            />
          </Form.Group>

          <EnumDropdown title = {"Type"} entityEnum = {EvidenceType}  onSelect={setSelectedType} enumDescription = {getEvidenceTypeDescription}></EnumDropdown>
          {/* <Form.Group className="mt-1" controlId="evidence.evidenceType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              type="text"
              name= "evidenceType"
              placeholder="File"
              value={formData.evidenceType}
              onChange={handleChange}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
        }
}

export default EditEvidence;