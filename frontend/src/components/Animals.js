import React, { useRef, useEffect, useState } from "react";
import $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Card, Col, Row, Image} from 'react-bootstrap';
import { Grid, h, createRef as gCreateRef } from "gridjs";
import { Popup } from "react-leaflet";
import {SliderWithInputFormControl} from "./Utils";
import Moment from 'react-moment';
import moment from 'moment';
import axios from "axios";


const fileTypes = /image\/(png|jpg|jpeg)/i;

function NewAnimal1({marker, createAnimalModalShow, setSelectedMarker, setCreateAnimalModalShow}) {
  // console.log(marker);
  const [show, setShow] = useState(false);

  const [ value_age_month, setAgeMonthValue ] = React.useState(1);
  const [ value_age_year, setAgeYearValue ] = React.useState(1);
  // const [ value_age_from_month, setAgeFromMonthValue ] = React.useState(1);
  // const [ value_age_from_year, setAgeFromYearValue ] = React.useState(2);
  // const [ value_age_to_month, setAgeToMonthValue ] = React.useState(1);
  // const [ value_age_to_year, setAgeToYearValue ] = React.useState(2);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  function NewAnimalForm(){
    const [description, setDescription] = useState(null);
    const [specie, setSpecie] = useState("dog");
    const [sex, setSex] = useState("M");
    const [bread, setBread] = useState("Pitbull");
    const [age_month_comp, setAgeMonthComp] = useState(1);
    const [age_year_comp, setAgeYearComp] = useState(1);
    const [age_from_month_comp, setAgeFromMonthComp] = useState(1);
    const [age_from_year_comp, setAgeFromYearComp] = useState(1);
    const [age_to_month_comp, setAgeToMonthComp] = useState(1);
    const [age_to_year_comp, setAgeToYearComp] = useState(1);

    const [tag_id, setTagId] = useState(null);
    const [rfid_code, setRfidCode] = useState(null);
    const [name, setName] = useState(null);
    const [address, setAddress] = useState(null);

    const [age_approx, setAgeApprox] = useState(false);
    const [show_other_params, setShowOtherParams] = useState(false);

    const [selected_file, setSelectedFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);

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

    function submit_handler(e) {
      console.log("Submit Marker: ", marker.geometry.coordinates);
      console.log(selected_file);
      console.log(description);
      console.log(specie);
      console.log(sex);
      console.log(bread);
      console.log(age_month_comp, age_year_comp);
      console.log(age_from_month_comp, age_from_year_comp);
      console.log(age_to_month_comp, age_to_year_comp);
      console.log(tag_id);
      console.log(rfid_code);
      console.log(name);
      console.log(address);

      const new_animal = {
        "species": specie,
        "sex": sex,
        // "breed_id": bread,
        "tag_id": tag_id,
        "rfid_code": rfid_code,
        "age_year": age_year_comp,
        "age_month": age_month_comp,
        "age_year_from": age_from_year_comp,
        "age_month_from": age_from_month_comp,
        "age_year_to": age_to_year_comp,
        "age_month_to": age_to_month_comp,
        "name": name,
        "description": description,
        "medias": [
          {
            "url": "string",
            "type": "image",
            "uploaded_by_user_id": 1,
            "date": moment().toISOString(new Date()),
            "description": "string",
            "animal_id": 0
          }
        ],
        "latitude": marker.geometry.coordinates[1],
        "longitude": marker.geometry.coordinates[0],
        "address": address
      };

      console.log(new_animal);

      axios.post("http://localhost:8000/api/v1/animal/create", new_animal).then((response) => {
        console.log(response);
        alert("New animal created successfully");
        setCreateAnimalModalShow(false);
      }).catch((error) => {
        console.error(error);
        alert("Failed to create new animal");
      });
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

    return (
      <>
        <Card.Img src={fileDataURL} />
        <Form.Group style={{"margin-top": "10px"}} controlId="formFile" className="mb-3">
          <Form.Control onChange={(e)=>file_handler(e)} type="file" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control onChange={(e) => {setDescription(e.target.value)}} as="textarea" rows={2}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
          <Form.Label>Specie</Form.Label>
          <Form.Control onChange={(e) => {setSpecie(e.target.value)}} as="select" >
            <option value={"dog"} >Dog</option>
            <option value={"cat"}>Cat</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
          <Form.Label>Sex</Form.Label>
          <Form.Control as="select" onChange={(e) => {setSex(e.target.value)}}>
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea4">
          <Form.Label>Bread</Form.Label>
          <Form.Control as="select" placeholder="Bread" onChange={(e) => {setBread(e.target.value)}} >
            <option value={"pitbull"}>Pitbull</option>
            <option value={"poodle"}>Poodle</option>
            <option value={"british-shorthair"}>British Shorthair</option>
          </Form.Control>
        </Form.Group>
        {!age_approx ?
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea5">
          <Form.Label>Age</Form.Label>
          <SliderWithInputFormControl id="age_month_comp" name="Age Month" value={age_month_comp} max="12" setValue={setAgeMonthComp} />
          <SliderWithInputFormControl id="age_year_comp" name="Age Year" value={age_year_comp} max="30" setValue={setAgeYearComp} />
        </Form.Group>
        :
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea6">
          <Form.Label>Age From-to</Form.Label>
          <Form.Group as={Row}>
            <Col xs="6">
              <SliderWithInputFormControl id="age_from_month_comp" name="Month" value={age_from_month_comp} max="12" setValue={setAgeFromMonthComp}/>
            </Col>
            <Col xs="6">
              <SliderWithInputFormControl id="age_from_year_comp" name="Year" value={age_from_year_comp} max="30" setValue={setAgeFromYearComp}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col xs="6">
              <SliderWithInputFormControl id="age_to_month_comp" name="Month" value={age_to_month_comp} max="12" setValue={setAgeToMonthComp} />
            </Col>
            <Col xs="6">
              <SliderWithInputFormControl id="age_to_year_comp" name="Year" value={age_to_year_comp} max="30" setValue={setAgeToYearComp} />
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
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea7">
            <Form.Control type="text" onChange={(e) => {setTagId(e.target.value)}} placeholder="Tag ID" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea8">
            <Form.Control type="text" onChange={(e) => {setRfidCode(e.target.value)}} placeholder="RFID Code" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea9">
            <Form.Control type="text" onChange={(e) => {setName(e.target.value)}} placeholder="Name" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea10">
            <Form.Control type="text" onChange={(e) => {setAddress(e.target.value)}} placeholder="Address" />
          </Form.Group>
        </>}
        <Button variant="primary" onClick={
            (e) => {
              submit_handler(e);
            }
          } >
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
    const [description, setDescription] = useState(null);
    const [specie, setSpecie] = useState(null);
    const [sex, setSex] = useState(null);
    const [bread, setBread] = useState(null);
    const [age_month_comp, setAgeMonthComp] = useState(1);
    const [age_year_comp, setAgeYearComp] = useState(1);
    const [age_from_month_comp, setAgeFromMonthComp] = useState(1);
    const [age_from_year_comp, setAgeFromYearComp] = useState(1);

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
            <Form.Control onChange={(e) => {setDescription(e.target.value)}} as="textarea" rows={2}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlSelect2">
            <Form.Label>Specie</Form.Label>
            <Form.Control as="select" onChange={(e)=>{setSpecie(e.target.value)}}>
              <option value={"dog"} >Dog</option>
              <option value={"cat"}>Cat</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
            <Form.Label>Sex</Form.Label>
            <Form.Control as="select" onChange={(e) => {setSex(e.target.value)}}>
              <option value={"M"}>Male</option>
              <option value={"F"}>Female</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea4">
            <Form.Label>Bread</Form.Label>
            <Form.Control as="select" placeholder="Bread" onChange={(e) => {setBread(e.target.value)}}>
              <option value={"Pitbull"}>Pitbull</option>
              <option value={"Poodle"}>Poodle</option>
              <option value={"british-shorthair"}>British Shorthair</option>
            </Form.Control>
          </Form.Group>
          {!age_approx ?
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea5">
            <Form.Label>Age</Form.Label>
            <SliderWithInputFormControl id="age_month_comp" name="Age Month" value={value_age_month} max="12" setValue={setAgeMonthComp}/>
            <SliderWithInputFormControl id="age_year_comp" name="Age Year" value={value_age_year} max="30" setValue={setAgeYearComp} />
          </Form.Group>
          :
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea6">
            <Form.Label>Age From-to</Form.Label>
            <Form.Group as={Row}>
              <Col xs="6">
                <SliderWithInputFormControl id="age_from_month_comp" name="Month" value={value_age_from_month} max="12" setValue={setAgeFromMonthComp} />
              </Col>
              <Col xs="6">
                <SliderWithInputFormControl id="age_from_year_comp" name="Year" value={value_age_from_year} max="30" setValue={setAgeFromYearComp}/>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col xs="6">
                <SliderWithInputFormControl id="age_to_month_comp" name="Month" value={value_age_to_month} max="12" />
              </Col>
              <Col xs="6">
                <SliderWithInputFormControl id="age_to_year_comp" name="Year" value={value_age_to_year} max="30" />
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea7">
              <Form.Control type="text" placeholder="Tag ID" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea8">
              <Form.Control type="text" placeholder="RFID Code" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea9">
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea10">
              <Form.Control type="text" placeholder="Address" />
            </Form.Group>
          </>}
          <Button onClick={
            (e) => {
              console.log("Submit");
              console.log(selected_file);
              console.log(description);
              // console.log($("#description_textarea").textContent);
              // console.log($("#age_month_comp_value").textContent);
            }
          } variant="primary">
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