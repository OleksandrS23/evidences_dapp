import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { login } from "../manager/auth.js"

function LoginComponent(props) {
  const { show, onClose ,onSuccess, drizzleContext} = props
  const { drizzle, drizzleState } = drizzleContext;
  const [formData, setFormData] = useState({ });

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log(formData)
    const account = drizzleContext.drizzleState.accounts[0];
    //console.log(account)
    login(account, formData.username, formData.password, err => {
        // if (err)
        //      alert(err)
    }).then(
        action => {
            if (action.type === "LOGIN_SUCCESS"){
                setFormData({});
                onSuccess();
            }
            else{
                setFormData({});
                onClose();
            }
          }
    )
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
    return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Group className="mt-1" controlId="login.userName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-1" controlId="login.password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form onSubmit={handleSubmit}>
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

export default LoginComponent;