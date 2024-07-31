import React, { useRef, useEffect, useState } from "react";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Card, Col, Row, Image } from "react-bootstrap";
import { Grid, h, html, createRef as gCreateRef } from "gridjs";
import { Popup } from "react-leaflet";
import { SliderWithInputFormControl } from "../components/Utils";
import Moment from "react-moment";
import moment from "moment";
import axios from "axios";

// start work
import dog from "../Images/german-dog.jpg";
import { testAnimals } from "../components/PropData";

import Resizer from "react-image-file-resizer";

const fileTypes = /image\/(png|jpg|jpeg)/i;

function NewAnimal1({
  marker,
  createAnimalModalShow,
  setSelectedMarker,
  setCreateAnimalModalShow,
}) {
  // console.log(marker);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function NewAnimalForm() {
    const [description, setDescription] = useState(null);
    const [specie, setSpecie] = useState("dog");
    const [sex, setSex] = useState("male");
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

    function resize_image(file, max_width, max_height) {
      return new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          max_width,
          max_height,
          "JPEG",
          100,
          0,
          (uri) => {
            resolve(uri);
          },
          "base64",
          200,
          200
        );
      });
    }

    function uploadFile(file, signedUrl) {
      console.log("Uploading file to S3:", file.type, "URL:", signedUrl);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/octet-stream",
        },
      };

      axios
        .put(signedUrl, file, config)
        .then((response) => {
          console.log("File uploaded successfully:", response);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }

    function submit_handler(e) {
      console.log("Submit Marker: ", marker.latitude, marker.longitude);
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
        species: specie,
        sex: sex,
        // "breed_id": bread,
        tag_id: tag_id,
        rfid_code: rfid_code,
        age_year: age_year_comp,
        age_month: age_month_comp,
        age_year_from: age_from_year_comp,
        age_month_from: age_from_month_comp,
        age_year_to: age_to_year_comp,
        age_month_to: age_to_month_comp,
        name: name,
        description: description,
        medias: [
          {
            url: "string",
            type: "image",
            uploaded_by_user_id: parseInt(localStorage.getItem("_id")),
            date: moment().toISOString(new Date()),
            description: "string",
            animal_id: 0,
          },
        ],
        latitude: marker.latitude,
        longitude: marker.longitude,
        address: address,
      };

      console.log(new_animal);

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .post("http://localhost:8000/api/v1/animal/create", new_animal, config)
        .then((response) => {
          console.log(response);
          // const file = resize_image(selected_file, 300, 300);
          uploadFile(selected_file, response.data.upload_url);
          alert("New animal created successfully");
          setCreateAnimalModalShow(false);
        })
        .catch((error) => {
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
        <Form.Group
          style={{ marginTop: "10px" }}
          controlId="formFile"
          className="mb-3"
        >
          <Form.Control onChange={(e) => file_handler(e)} type="file" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            as="textarea"
            rows={2}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
          <Form.Label>Specie</Form.Label>
          <Form.Control
            onChange={(e) => {
              setSpecie(e.target.value);
            }}
            as="select"
          >
            <option value={"dog"}>Dog</option>
            <option value={"cat"}>Cat</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
          <Form.Label>Sex</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              setSex(e.target.value);
            }}
          >
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea4">
          <Form.Label>Bread</Form.Label>
          <Form.Control
            as="select"
            placeholder="Breed"
            onChange={(e) => {
              setBread(e.target.value);
            }}
          >
            <option value={"pitbull"}>Pitbull</option>
            <option value={"poodle"}>Poodle</option>
            <option value={"georgian-sheppard"}>Georgian Sheppard</option>
            <option value={"german-sheppard"}>German Sheppard</option>
            <option value={"labrador-retriever"}>Labrador Retriever</option>
            <option value={"Mixed"}>Mixed</option>
            <option value={"british-shorthair"}>British Shorthair</option>
          </Form.Control>
        </Form.Group>
        {!age_approx ? (
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea5">
            <Form.Label>Age</Form.Label>
            <SliderWithInputFormControl
              id="age_month_comp"
              name="Age Month"
              value={age_month_comp}
              max="12"
              setValue={setAgeMonthComp}
            />
            <SliderWithInputFormControl
              id="age_year_comp"
              name="Age Year"
              value={age_year_comp}
              max="30"
              setValue={setAgeYearComp}
            />
          </Form.Group>
        ) : (
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea6">
            <Form.Label>Age From-to</Form.Label>
            <Form.Group as={Row}>
              <Col xs="6">
                <SliderWithInputFormControl
                  id="age_from_month_comp"
                  name="Month"
                  value={age_from_month_comp}
                  max="12"
                  setValue={setAgeFromMonthComp}
                />
              </Col>
              <Col xs="6">
                <SliderWithInputFormControl
                  id="age_from_year_comp"
                  name="Year"
                  value={age_from_year_comp}
                  max="30"
                  setValue={setAgeFromYearComp}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col xs="6">
                <SliderWithInputFormControl
                  id="age_to_month_comp"
                  name="Month"
                  value={age_to_month_comp}
                  max="12"
                  setValue={setAgeToMonthComp}
                />
              </Col>
              <Col xs="6">
                <SliderWithInputFormControl
                  id="age_to_year_comp"
                  name="Year"
                  value={age_to_year_comp}
                  max="30"
                  setValue={setAgeToYearComp}
                />
              </Col>
            </Form.Group>
          </Form.Group>
        )}
        <Form.Check
          type="checkbox"
          id="add_edit_new_anumal_check"
          onChange={(e) => setAgeApprox(e.target.checked)}
          label="Relative Age"
        ></Form.Check>
        <Form.Check
          type="checkbox"
          id="add_set_other_params_check"
          onChange={(e) => setShowOtherParams(e.target.checked)}
          label="Other Params"
        ></Form.Check>
        {show_other_params && (
          <>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea7"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTagId(e.target.value);
                }}
                placeholder="Tag ID"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea8"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setRfidCode(e.target.value);
                }}
                placeholder="RFID Code"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea9"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea10"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                placeholder="Address"
              />
            </Form.Group>
          </>
        )}
        <Button
          variant="primary"
          onClick={(e) => {
            submit_handler(e);
          }}
        >
          Submit
        </Button>
      </>
    );
  }

  return <NewAnimalForm />;
}

function NewAnimal({
  marker,
  createAnimalModalShow,
  setSelectedMarker,
  setCreateAnimalModalShow,
}) {
  // console.log(marker);
  const [show, setShow] = useState(false);
  const [selected_file, setSelectedFile] = useState(null);

  const [fileDataURL, setFileDataURL] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    <Popup>
      <Card style={{ width: "20rem" }}>
        {fileDataURL !== null && <Card.Img variant="top" src={fileDataURL} />}
        <Card.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Button
                variant="primary"
                onClick={(e) => {
                  setCreateAnimalModalShow(true);
                  if (setSelectedMarker) {
                    setSelectedMarker(marker);
                  }
                }}
              >
                New Animal
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Popup>
  );
}

function Animals() {
  // const [allanimal, setAllenimal] = useState
  const wrapperRef = useRef(null);
  console.log("animals");
  const formatDate = (isoDate, showTime) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(showTime && {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };
    return date.toLocaleDateString(undefined, options);
  };

  const grid = new Grid({
    sort: true,
    resizable: true,
    search: true,
    columns: [
      "Address",
      "Age",
      "Age Relative",
      "Created",
      "Description",
      "Name",
      "RFID",
      "Image",
      "Sex",
      "Tag ID",
    ],
    // sruliad shesacvlelia
    server: {
      url: "http://localhost:8000/api/v1/animal/animals",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      then: (data) => {
        console.log(data);
        return data.map((animal) => [
          animal.address,
          html(
            `<strong>${animal.age_year} Year and ${animal.age_month} Month</strong>`
          ),
          html(
            `<strong>From ${animal.age_year_from} Year and ${animal.age_month_from} Month</span>
          <strong>To ${animal.age_year_to} Year and ${animal.age_month_to} Month</strong>`
          ),
          html(`<p>${formatDate(animal.created_at, true)}</p>`),
          animal.description,
          animal.name,
          animal.rfid_code,
          html(
            `<img src="${animal.public_url}" alt="Animal Image" width="200" height="300">`
          ),
          html(`<h3>${animal.sex === "male" ? "♂" : "♀"}</h3>`),
          animal.tag_id,
        ]);
      },

      total: (data) => data.length,
    },
  });

  useEffect(() => {
    // grid.render(wrapperRef.current);
  });

  const conditonsTyleReturn = (conditon) => {
    if (conditon == "not bad") {
      return "bg-yellow-300";
    }
    if (conditon == "good") {
      return "bg-green-300";
    }
    if (conditon == "bad") {
      return "bg-red-300";
    }
  };

  return (
    // <div
    //   className="mt-[--margin-top]"
    //   style={{ "margin-left": "3%", "margin-right": "5%" }}
    //   ref={wrapperRef}
    // />
    <div className="mt-[--margin-top]    ">
      {/* main first container */}
      <div className="  mt-16 flex items-center gap-2 font-font1 font-medium bg-gradient-to-r from-indigo-200 to-indigo-300 p-1  ">
        {/* sortedby */}
        <i className="pl-[--pading-left] ">Sorted By:</i>&nbsp;
        <p className=" text-sm cursor-pointer">Sort1</p>
        <p className=" text-sm cursor-pointer">Sort2</p>
        <p className=" text-sm cursor-pointer">Sort3</p>
      </div>
      {/* main second container */}
      <div className=" font-font1  mt-16 pl-[--pading-left] pr-[--pading-right] bg-indigo-300 pb-10">
        {/* main-div */}
        <div className=" flex flex-wrap gap-2 items-center justify-center sm:justify-start ">
          {testAnimals.map((animal) => {
            return (
              <div class=" h-80  w-[calc(100%-0.5rem)] sm:w-[calc((100%/3)-0.5rem)] rounded overflow-scroll shadow-lg bg-gradient-to-r from-indigo-200 to-indigo-300">
                <img class="w-full" src={dog} alt="dog" />

                {/* small container age name sex */}
                <div className=" mt-1.5 pl-2">
                  <div className=" font-semibold text-xs">
                    <span>Name:</span>&nbsp;
                    <span className=" ">{animal.name}</span>
                  </div>
                  <div className=" font-semibold text-xs">
                    <span>Age:</span>&nbsp;
                    <span className=" ">{animal.age}</span>
                  </div>
                  <div className=" font-semibold text-xs">
                    <span>Sex:</span>&nbsp;
                    <span className=" ">{animal.sex}</span>
                  </div>
                  <div className=" font-semibold text-xs">
                    <span>Created:</span>&nbsp;
                    <span className=" ">{animal.created}</span>
                  </div>
                  <div className=" font-semibold text-xs">
                    <span>Condition:</span>&nbsp;
                    <span className={conditonsTyleReturn(animal.conditions)}>
                      {animal.conditions}
                    </span>
                  </div>
                </div>
                {/* Desc Container */}
                <div className=" pl-2 mt-2  text-xs pb-3">
                  <i className="font-semibold">Description:</i>
                  <p>{animal.description}</p>
                </div>
              </div>
            );
          })}
          {/* one whole card item */}
        </div>
      </div>
    </div>
  );
}

export { Animals, NewAnimal, NewAnimal1 };
