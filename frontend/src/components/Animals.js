import React, { useRef, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Card, Col, Row, Image} from 'react-bootstrap';
import { Grid, h, createRef as gCreateRef } from "gridjs";
import { Popup } from "react-leaflet";
import {SliderWithInputFormControl} from "./Utils";

const fileTypes = /image\/(png|jpg|jpeg)/i;

function NewAnimal1({marker, createAnimalModalShow, setSelectedMarker, setCreateAnimalModalShow}) {
  // console.log(marker);
  const [show, setShow] = useState(false);
  const [selected_file, setSelectedFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  const [age_approx, setAgeApprox] = useState(false);
  const [show_other_params, setShowOtherParams] = useState(false);

  const [ value_age_month, setAgeMonthValue ] = React.useState(1);
  const [ value_age_year, setAgeYearValue ] = React.useState(1);
  const [ value_age_from_month, setAgeFromMonthValue ] = React.useState(1);
  const [ value_age_from_year, setAgeFromYearValue ] = React.useState(2);
  const [ value_age_to_month, setAgeToMonthValue ] = React.useState(1);
  const [ value_age_to_year, setAgeToYearValue ] = React.useState(2);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function file_handler(e) {
      console.log(e);
      // get file object
      var file = e.target.files[0];
      
      if (!file.type.match(fileTypes)) {
        alert("Image mime type is not valid");
        return;
      }
      setSelectedFile(file);
  }

  useEffect(() => {
      if (selected_file !== null) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileDataURL(e.target.result);
        };
        reader.readAsDataURL(selected_file);
      }
  });

  function NewAnimalForm(){
    return (
      <>
        <Card.Img src={fileDataURL} />
        <Form.Group style={{"margin-top": "10px"}} controlId="formFile" className="mb-3">
          <Form.Control onChange={(e)=>file_handler(e)} type="file" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Specie</Form.Label>
          <Form.Control as="select">
            <option value={"dog"} >Dog</option>
            <option value={"cat"}>Cat</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Sex</Form.Label>
          <Form.Control as="select">
            <option value={"M"}>Male</option>
            <option value={"F"}>Female</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Bread</Form.Label>
          <Form.Control as="select" placeholder="Bread">
            <option value={"Pitbull"}>Pitbull</option>
            <option value={"Poodle"}>Poodle</option>
            <option value={"british-shorthair"}>British Shorthair</option>
          </Form.Control>
        </Form.Group>
        {!age_approx ?
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Age</Form.Label>
          <SliderWithInputFormControl id="age_month_comp" name="Age Month" default_value={value_age_month} max="12" />
          <SliderWithInputFormControl id="age_year_comp" name="Age Year" default_value={value_age_year} max="30" />
        </Form.Group>
        :
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Age From-to</Form.Label>
          <Form.Group as={Row}>
            <Col xs="6">
              <SliderWithInputFormControl id="age_from_month_comp" name="Month" default_value={value_age_from_month} max="12" />
            </Col>
            <Col xs="6">
              <SliderWithInputFormControl id="age_from_year_comp" name="Year" default_value={value_age_from_year} max="30" />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col xs="6">
              <SliderWithInputFormControl id="age_to_month_comp" name="Month" default_value={value_age_to_month} max="12" />
            </Col>
            <Col xs="6">
              <SliderWithInputFormControl id="age_to_year_comp" name="Year" default_value={value_age_to_year} max="30" />
            </Col>
          </Form.Group>
        </Form.Group>}
        <Form.Check type="checkbox" id="add_edit_new_anumal_check"
          onChange={(e) => setAgeApprox(e.target.checked)} label="Relative Age">
        </Form.Check>
        <Form.Check type="checkbox" id="add_set_other_params_check"
          onChange={(e) => setShowOtherParams(e.target.checked)} label="Other Params">
        </Form.Check>
        {show_other_params &&
        <>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control type="text" placeholder="Tag ID" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control type="text" placeholder="RFID Code" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control type="text" placeholder="Name" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control type="text" placeholder="Address" />
          </Form.Group>
        </>}
        <Button variant="primary">
          Submit
        </Button>
      </>
    )
  }

  return (
    <NewAnimalForm />
  );
}


function NewAnimal({marker, createAnimalModalShow, setSelectedMarker, setCreateAnimalModalShow}) {
    // console.log(marker);
    const [show, setShow] = useState(false);
    const [selected_file, setSelectedFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);

    const [age_approx, setAgeApprox] = useState(false);
    const [show_other_params, setShowOtherParams] = useState(false);

    const [ value_age_month, setAgeMonthValue ] = React.useState(1);
    const [ value_age_year, setAgeYearValue ] = React.useState(1);
    const [ value_age_from_month, setAgeFromMonthValue ] = React.useState(1);
    const [ value_age_from_year, setAgeFromYearValue ] = React.useState(2);
    const [ value_age_to_month, setAgeToMonthValue ] = React.useState(1);
    const [ value_age_to_year, setAgeToYearValue ] = React.useState(2);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function file_handler(e) {
        console.log(e);
        // get file object
        var file = e.target.files[0];
        
        if (!file.type.match(fileTypes)) {
          alert("Image mime type is not valid");
          return;
        }
        setSelectedFile(file);
    }

    useEffect(() => {
        if (selected_file !== null) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFileDataURL(e.target.result);
          };
          reader.readAsDataURL(selected_file);
        }
    });
    function isMobile() {
      const minWidth = 768;
      return window.innerWidth < minWidth || window.innerWidth < minWidth;
    }

    function NewAnimalForm(){
      return (
        <>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload image</Form.Label>
            <Form.Control onChange={(e)=>file_handler(e)} type="file" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Specie</Form.Label>
            <Form.Control as="select">
              <option value={"dog"} >Dog</option>
              <option value={"cat"}>Cat</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Sex</Form.Label>
            <Form.Control as="select">
              <option value={"M"}>Male</option>
              <option value={"F"}>Female</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Bread</Form.Label>
            <Form.Control as="select" placeholder="Bread">
              <option value={"Pitbull"}>Pitbull</option>
              <option value={"Poodle"}>Poodle</option>
              <option value={"british-shorthair"}>British Shorthair</option>
            </Form.Control>
          </Form.Group>
          {!age_approx ?
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Age</Form.Label>
            <SliderWithInputFormControl id="age_month_comp" name="Age Month" default_value={value_age_month} max="12" />
            <SliderWithInputFormControl id="age_year_comp" name="Age Year" default_value={value_age_year} max="30" />
          </Form.Group>
          :
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Age From-to</Form.Label>
            <Form.Group as={Row}>
              <Col xs="6">
                <SliderWithInputFormControl id="age_from_month_comp" name="Month" default_value={value_age_from_month} max="12" />
              </Col>
              <Col xs="6">
                <SliderWithInputFormControl id="age_from_year_comp" name="Year" default_value={value_age_from_year} max="30" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col xs="6">
                <SliderWithInputFormControl id="age_to_month_comp" name="Month" default_value={value_age_to_month} max="12" />
              </Col>
              <Col xs="6">
                <SliderWithInputFormControl id="age_to_year_comp" name="Year" default_value={value_age_to_year} max="30" />
              </Col>
            </Form.Group>
          </Form.Group>}
          <Form.Check type="checkbox" id="add_edit_new_anumal_check"
            onChange={(e) => setAgeApprox(e.target.checked)} label="Relative Age">
          </Form.Check>
          <Form.Check type="checkbox" id="add_set_other_params_check"
            onChange={(e) => setShowOtherParams(e.target.checked)} label="Other Params">
          </Form.Check>
          {show_other_params &&
          <>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control type="text" placeholder="Tag ID" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control type="text" placeholder="RFID Code" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control type="text" placeholder="Address" />
            </Form.Group>
          </>}
          <Button variant="primary">
            Submit
          </Button>
        </>
      )
    }

    return (
      <Popup>
        <Card style={{ width: '20rem' }}>
          {(fileDataURL !== null) && <Card.Img variant="top" src={fileDataURL} /> }
          <Card.Body>
            <Form>
              { isMobile() ?
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Button variant="primary" onClick={
                    (e) => {
                        setCreateAnimalModalShow(true);
                        if (setSelectedMarker) {
                          setSelectedMarker(marker);
                        }
                    }
                  }>New Animal</Button>
                </Form.Group>
                :
                <NewAnimalForm />
              }
            </Form>
          </Card.Body>
        </Card>
      </Popup>
    );
}

function Animals () {
    const wrapperRef = useRef(null);
    const grid = new Grid({
        columns: [
         {
           name: 'Name',
           formatter: (cell) => cell.firstName
         }, 
         'Email',
         'Phone Number'
        ],
        search: {
          selector: (cell, rowIndex, cellIndex) => cellIndex === 0 ? cell.firstName : cell
        },
        data: [
          [{ firstName: 'John', lastName: 'MP' }, 'john@example.com', '(353) 01 222 3333'],
          [{ firstName: 'Mark', lastName: 'Blue' }, 'mark@gmail.com',   '(01) 22 888 4444'],
          [{ firstName: 'Eoin', lastName: 'Kavanagh' }, 'eo3n@yahoo.com',   '(05) 10 878 5554'],
          [{ firstName: 'Megan', lastName: 'Niesen' }, 'nis900@gmail.com',   '313 333 1923']
        ]
    });
    
    useEffect(() => {
      grid.render(wrapperRef.current);
    });
    
    return <div ref={wrapperRef} />;
  }
  
  export {Animals, NewAnimal, NewAnimal1};