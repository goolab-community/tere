import { Form, Row, Col } from 'react-bootstrap';
import React from 'react';

function SliderWithInputFormControl({id, name, default_value, max}) {

    const [ value, setValue ] = React.useState(default_value);
    return (
      <Form key={id}>
        <Form.Group as={Row}>
          <Col xs="9">
            <Form.Label>{name}</Form.Label>
            <Form.Range
              value={value}
              max={max}
              onChange={e => setValue(e.target.value)}
            />
          </Col>
          <Col xs="3">
            <Form.Text>
              {value}
            </Form.Text>
          </Col>
        </Form.Group>
      </Form>
    );
}

export {SliderWithInputFormControl};