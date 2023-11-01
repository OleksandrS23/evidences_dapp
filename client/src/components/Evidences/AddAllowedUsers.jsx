import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddAllowedUsers(props) {
  const { show, onClose , drizzleContext, data} = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
        evidenceUniqueCode: data?.uniqueCode,
    });

   useEffect(() => {
            if (data) {
              setFormData({
                evidenceUniqueCode: data.uniqueCode,
              });
            }
          }, [data])


  const handleSubmit = (event) => {
    event.preventDefault();
    const contractInstance = drizzle.contracts.EvidenceChain;
    const methodArgs = [formData.evidenceUniqueCode, items];
    const stackId = contractInstance.methods.addAllowedUsers.cacheSend(...methodArgs)
    setFormData({});
    setItems([]);
    onClose();
  };

  const onCloseModal = () =>{
    setFormData({});
    setItems([]);
    onClose();
  }

  const addItem = () => {
    if (inputValue.trim() !== '') {
      setItems([...items, inputValue]);
      setInputValue('');
      //console.log(items)
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

    if (!data){}
    else{
        return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Allowed Users: {formData.evidenceUniqueCode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div>
            {items.map((element, index) => (
            <p key={index}>{element}</p>
            ))}
      </div>

      <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-1" controlId="evidence.address">
            <Form.Label>User Address</Form.Label>
            <Form.Control
              type="text"
              name= "address"
              placeholder="Address"
              value={inputValue}
              onChange={handleChange}
            />
            <Button className="mt-2" onClick={addItem}>Add</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseModal}>
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

export default AddAllowedUsers;