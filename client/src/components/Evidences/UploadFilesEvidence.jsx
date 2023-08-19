import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import * as CryptoJS from 'crypto-js';

function UploadFilesEvidence(props) {
  const { show, onClose, drizzleContext, data } = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
    evidenceUniqueCode: data?.uniqueCode,
    files: [],
  });

  useEffect(() => {
    if (data) {
      setFormData({
        evidenceUniqueCode: data.uniqueCode,
        files: [],
      });
    }
  }, [data]);

  const handleSubmit = (event) => {
    if (formData.files.length > 0) 
    {
      event.preventDefault();
      console.log(formData)
       const contractInstance = drizzle.contracts.EvidenceChain;
       const methodArgs = [formData.evidenceUniqueCode, formData.files];
       const stackId = contractInstance.methods.addFiles.cacheSend(
         ...methodArgs
       );
      setFormData({});
      onClose();
    }
  };

  const handleChange = async (event) => {
    console.log(event.target);
    const files = Array.from(event.target.files);
  
    try {
      const hashPromises = files.map(async (file) => {
        const fileContent = await file.text();
        const hash = CryptoJS.SHA256(fileContent).toString();
        return hash;
      });
      const hashes = await Promise.all(hashPromises);
      setFormData({ ...formData, files: hashes });
    } catch (error) {
      console.error("Error processing files:", error);
    }
  };

  if (!data) {
  } else {
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Upload Files: {formData.evidenceUniqueCode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Files</Form.Label>
              <Form.Control 
              type="file" 
              multiple
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

export default UploadFilesEvidence;
