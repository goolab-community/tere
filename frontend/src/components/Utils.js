import { Form, Row, Col } from 'react-bootstrap';
import React from 'react';
import axios from 'axios';


function SliderWithInputFormControl({id, name, value, max, setValue}) {

    // const [ _value, setLocalValue ] = React.useState(value);

    function setVal(e){
      // console.log(setValue);
      console.log("setVal", e.target.value);
      setValue(e.target.value);
      // setLocalValue(e.target.value);
    };

    return (
      <Form key={id}>
        <Form.Group as={Row}>
          <Col xs="9">
            <Form.Label>{name}</Form.Label>
            <Form.Range
              value={value}
              max={max}
              onChange={e => setVal(e)}
            />
          </Col>
          <Col xs="3">
            <Form.Text id={id+"_value"}>
              {value}
            </Form.Text>
          </Col>
        </Form.Group>
      </Form>
    );
}


function uploadFile(file, signedUrl) {
  console.log("Uploading file to S3:", file.type, "URL:", signedUrl);
  const config = {
    headers: {
      // 'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/octet-stream',
    },
  };

  axios.put(signedUrl, file, config)
    .then(response => {
        console.log('File uploaded successfully:', response);
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
}


export {SliderWithInputFormControl, uploadFile};