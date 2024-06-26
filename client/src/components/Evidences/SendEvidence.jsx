import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function SendEvidence(props) {
  const { show, onClose , drizzleContext, data} = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
        evidenceUniqueCode: data?.uniqueCode,
        newOwnerAddress: ''
    });

   useEffect(() => {
            if (data) {
              setFormData({
                evidenceUniqueCode: data.uniqueCode,
                newOwnerAddress:''
              });
            }
          }, [data])


  const handleSubmit = (event) => {
    event.preventDefault();
    const contractInstance = drizzle.contracts.EvidenceChain;
    const methodArgs = [formData.evidenceUniqueCode, formData.newOwnerAddress];
    const stackId = contractInstance.methods.evidenceNewOwner.cacheSend(...methodArgs)
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
        <Modal.Title>Send Evidence: {formData.evidenceUniqueCode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-1" controlId="evidence.newOwnerAddress">
            <Form.Label>New Owner</Form.Label>
            <Form.Control
              type="text"
              name= "newOwnerAddress"
              placeholder="Address"
              value={formData.newOwnerAddress}
              onChange={handleChange}
            />
          </Form.Group>
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

export default SendEvidence;