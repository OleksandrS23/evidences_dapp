import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

function EnumDropdown({ entityEnum, enumDescription, title, onSelect}) {
  const [selectedEnum, setSelectedEnum] = useState(null);

  const handleSelect = (enumValue) => {
    setSelectedEnum(entityEnum[enumValue]);
    onSelect(entityEnum[enumValue]);
  };

  return (
    <Form  className="mt-2">
        <Form.Label>{title}</Form.Label>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedEnum !== null ? enumDescription(selectedEnum): `Select an ${title}`}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(entityEnum).map((key) => (
            <Dropdown.Item key={key} eventKey={key}>
              {enumDescription(entityEnum[key])}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Form>
  );
}

export default EnumDropdown;
