import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from 'axios';
import consts from '../../manager/consts';
import { GetFileHash } from "../../manager/filesManger.js";

function UploadFilesEvidence(props) {
  const { show, onClose, drizzleContext, data } = props;
  const { drizzle, drizzleState } = drizzleContext;
  // const [fromDataToChain, setFormDataToChain] = useState({
  //   evidenceUniqueCode: data.uniqueCode,
  //   files: []
  // }); 

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


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataReq = new FormData();
    console.log(formData.files)
    const files = [];

    for (let i = 0; i < formData.files.length; i++) {
        // let fileHash = await GetFileHash(formData.files[i])
        // console.log(formData.files[i])
        // files.push({filename: formData.files[i].name, fileHash: fileHash})
        formDataReq.append('files', formData.files[i]);
    }
    
    console.log(files)

    const url = consts.API_URL + `files/upload?evidenceCode=${encodeURIComponent(formData.evidenceUniqueCode)}&address=${encodeURIComponent(drizzleContext.drizzleState.accounts[0])}` ; // Replace with your API endpoint
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(url, formDataReq, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });

        console.log('Files uploaded:', response.data);

        if (response.data.uploadedFileIds){
          response.data.uploadedFileIds.forEach(element => {
          console.log(element)
           const contractInstance = drizzle.contracts.EvidenceChain;
           const methodArgs = [formData.evidenceUniqueCode, element.id, element.filename, element.filehash];
           const stackId = contractInstance.methods.addFile.cacheSend(...methodArgs)
        });
      }
       
        setFormData({});
        onClose();
    } catch (error) {
      console.log(error)
      if (error?.response?.status === 401){
        localStorage.removeItem("token")
      }
        console.error('Error uploading files:', error);
    }
};


  // const handleSubmit = (event) => {
  //   if (formData.files.length > 0) 
  //   {
  //     event.preventDefault();
  //     console.log(formData.files)
  //     // console.log(formData)
  //     //  const contractInstance = drizzle.contracts.EvidenceChain;
  //     //  const methodArgs = [formData.evidenceUniqueCode, formData.files];
  //     //  const stackId = contractInstance.methods.addFiles.cacheSend(
  //     //    ...methodArgs
  //     //  );
  //     // setFormData({});
  //     // onClose();
  //   }
  // };

  const handleChange = async (event) => {
    console.log(event.target);
    const files = Array.from(event.target.files);
  
    try {
      // const hashPromises = files.map(async (file) => {
      //   const fileContent = await file.text();
      //   const hash = CryptoJS.SHA256(fileContent).toString();
      //   return hash;
      // });
      // const hashes = await Promise.all(hashPromises);
      setFormData({ ...formData, files: files });
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
