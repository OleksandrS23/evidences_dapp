import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { login } from "../manager/auth.js";
import { EntityType, getEntityTypeDescription } from "../enums/EntityEnums.js";
import EnumDropdown from "./EnumDropDown.jsx";


function RegisterComponent(props) {
  const { show, onClose, onSuccess, drizzleContext } = props;
  const { drizzle, drizzleState } = drizzleContext;
  const [formData, setFormData] = useState({
    name: "",
    departmentCode: "",
    password: "",
    username: "",
    confpassword: "",
  });
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    setValidated(true);
    if (formData.password != formData.confpassword) {
        // Passwords don't match, set error state
        console.error('Passwords do not match');
        setPasswordMatch(false);
      }

    if (form.checkValidity() && passwordMatch) {
        //console.log(1)
       const contractInstance = drizzle.contracts.EvidenceChain;
       const methodArgs = [
        drizzleState.accounts[0],
         formData.username,
         formData.password,
         formData.name,
         formData.departmentCode,
         selectedEntity
       ];
       const stackId = contractInstance.methods.addEntity.cacheSend(
         ...methodArgs
       );
       setFormData({});
       setValidated(false);
       onClose();
    } else {
        //console.log(2)
       setValidated(true);
     }
  };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(formData);
//     const account = drizzleContext.drizzleState.accounts[0];
//     console.log(account);
//     login(account, formData.username, formData.password, (err) => {
//       // if (err)
//       //      alert(err)
//     }).then((action) => {
//       if (action.type === "LOGIN_SUCCESS") {
//         setFormData({});
//         onSuccess();
//       } else {
//         setFormData({});
//         onClose();
//       }
//     });
//   };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setPasswordMatch(true);
  };
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-1" controlId="register.name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <EnumDropdown title = {"Type"} entityEnum = {EntityType}  onSelect={setSelectedEntity} enumDescription = {getEntityTypeDescription}></EnumDropdown>
        
        <Form.Group className="mt-1" controlId="register.departmentCode">
          <Form.Label>Department Code</Form.Label>
          <Form.Control
            required
            type="text"
            name="departmentCode"
            value={formData.departmentCode}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-1" controlId="register.userName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-1" controlId="register.password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-1" controlId="register.confpassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confpassword"
            value={formData.confpassword}
            onChange={handleChange}
            isInvalid={!passwordMatch}
          />
        </Form.Group>
        <div className="d-flex justify-content-end mt-3">
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

export default RegisterComponent;
