import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
import { Card, Col, Row } from "react-bootstrap";

import { Popup } from "react-leaflet";
import { SliderWithInputFormControl } from "../components/Utils";

import moment from "moment";
import axios from "axios";

import dog from "../Images/german-dog.jpg";
import { animals, testAnimals } from "../components/PropData";

import "../css/modal.css";
import { Form } from "react-bootstrap";

// redux
import { useSelector, useDispatch } from "react-redux";
import { loadanimals, loadMoreAnimals } from "../redux/reducers/animals";

import { API_URL } from "../config";


const fileTypes = /image\/(png|jpg|jpeg)/i;

// new animala add form modal
function NewAnimal1({
  marker,
  createAnimalModalShow,
  setSelectedMarker,
  setCreateAnimalModalShow,
}) {

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
    const [resizedImage, setResizedImage] = useState(null);
    const [resizedImageFile, setResizedImageFile] = useState(null);

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
      handleResizeImage(e);
    }

    const handleResizeImage = (event) => {
      const file = event.target.files[0];
      if (file) {
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        console.log("File - : ", file);

        img.onload = () => {
          const desiredWidth = 200;
          const aspectRatio = img.width / img.height;
          const newWidth = desiredWidth;
          const newHeight = desiredWidth / aspectRatio;

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob((blob) => {
            const newFile = new File([blob], file.name, { type: file.type });
            setResizedImageFile(newFile);
            const resizedImageURL = URL.createObjectURL(newFile);
            setResizedImage(resizedImageURL);
          }, file.type);
        };

        img.src = URL.createObjectURL(file);
      }
    };

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
        .post(`${API_URL}/animal/create`, new_animal, config)
        .then((response) => {
          console.log(response);
          uploadFile(selected_file, response.data.upload_url);
          uploadFile(resizedImageFile, response.data.upload_url_icon);
          alert("New animal created successfully");
          setCreateAnimalModalShow(false);
          window.location.reload();
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
        {resizedImage && <img src={resizedImage} alt="Resized" />}
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
        <div className=" mt-3">
          <Button
            className=""
            variant="primary"
            onClick={(e) => {
              submit_handler(e);
            }}
          >
            Save
          </Button>
        </div>
      </>
    );
  }

  return <NewAnimalForm />;
}

// enimall add popup small
function NewAnimal({ marker, setSelectedMarker, setCreateAnimalModalShow }) {
  const [selected_file, setSelectedFile] = useState(null);

  const [fileDataURL, setFileDataURL] = useState(null);

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
  const animals = useSelector((state) => state.animals[0].allAnimals);
  console.log(animals);
  const dispatch = useDispatch();

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

  // sort action
  const handleSortClick = (SortBy) => {
    // here request

    console.log(SortBy);
  };

  // load more action
  const handleLoadmoreClick = () => {
    // if (localStorage.token) {
    //   fetch(`${API_URL}/animal/animals`, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) =>
    //       dispatch(loadanimals({ allAnimals: [animals, ...allanimals] }))
    //     )

    //     .catch((error) => console.error(error));
    // }
    dispatch(loadMoreAnimals({ loadanimals: [...animals, ...testAnimals] }));

    console.log("lodad more");
  };

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

  useState(() => {
    if (animals.length == 0)
      fetch(`${API_URL}/animal/animals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) =>
          dispatch(
            loadanimals({ allAnimals: [...data] }),
            console.log(data + " from animals usefect")
          )
        )

        .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col">
      <div className="mt-[--margin-top]    ">
        {/* main first container */}

        <div className="  mt-16 flex items-center gap-2 font-font1 font-medium bg-gradient-to-r from-indigo-200 to-indigo-300 p-1 leading-8 ">
          {/* sortedby */}
          <p className="pl-[--pading-left] ">
            <svg
              className="w-5 h-5 text-gray-800 dark:text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
              />
            </svg>
          </p>
          &nbsp;
          <p
            className=" text-sm cursor-pointer hover:underline underline-offset-4 hover:decoration-white "
            onClick={() => handleSortClick("age")}
          >
            Age
          </p>
          <p
            className=" text-sm cursor-pointer hover:underline underline-offset-4 hover:decoration-white "
            onClick={() => handleSortClick("nearest")}
          >
            Nearest
          </p>
          <p
            className=" text-sm cursor-pointer hover:underline underline-offset-4 hover:decoration-white "
            onClick={() => handleSortClick("Last-Updated")}
          >
            Last-Updated
          </p>
        </div>

        {/* main second container */}
        {animals.length == 0 ? (
          <p className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
            Loading ...
          </p>
        ) : (
          <div className=" font-font1  mt-16 pl-[--pading-left] pr-[--pading-right] bg-indigo-300 pb-2">
            {/* main-div */}
            <div className=" flex flex-wrap gap-2 items-center justify-center sm:justify-start ">
              {animals.map((animal, i) => {
                return (
                  <div
                    key={i}
                    className=" h-80 w-[calc(100%-0.5rem)] sm:h-80 sm:w-[calc((100%/3)-0.5rem)] rounded overflow-scroll shadow-lg bg-gradient-to-r from-indigo-200 to-indigo-300"
                  >
                    {/* img and dog info div */}
                    <div className=" flex flex-col sm:flex-col lg:flex-row">
                      <img
                        className="w-full lg:w-48 lg:h-40"
                        src={dog}
                        alt="dog"
                      />
                      <div className=" mt-1.5 pl-2">
                        <div className=" font-semibold text-xs">
                          <span>Name:</span>&nbsp;
                          <span className=" ">{animal.name}</span>
                        </div>
                        <div className=" font-semibold text-xs">
                          <span>Age:</span>&nbsp;
                          <span className=" ">{animal.age_year}</span>
                        </div>
                        <div className=" font-semibold text-xs">
                          <span>Sex:</span>&nbsp;
                          <span className=" ">{animal.sex}</span>
                        </div>
                        <div className=" font-semibold text-xs">
                          <span>Created:</span>&nbsp;
                          <span className=" ">{animal.created_at}</span>
                        </div>
                        <div className=" font-semibold text-xs">
                          <span>Updated:</span>&nbsp;
                          <span className=" ">{animal.updated_at}</span>
                        </div>
                        <div className=" font-semibold text-xs">
                          <span>Condition:</span>&nbsp;
                          <span
                            className={conditonsTyleReturn(animal.conditions)}
                          >
                            {animal.conditions}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* small container age name sex */}

                    {/* Desc Container */}
                    <div className=" pl-2 mt-2  text-xs pb-3">
                      <i className="font-semibold">Description:</i>
                      <p>{animal.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Load more */}
      {animals.length > 0 && (
        <div className="flex items-center justify-center text-center bg-indigo-300 p-3">
          <button
            onClick={handleLoadmoreClick}
            type="submit"
            className="  text-white bg-gradient-to-r from-indigo-200 via-indigo-300 to-blue-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-300 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-900/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 "
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export { Animals, NewAnimal, NewAnimal1 };
