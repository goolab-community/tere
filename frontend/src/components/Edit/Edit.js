import Modal from "react-bootstrap/Modal";
import { Card, Form, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editStateAction } from "../../redux/reducers/nessesaryState";
import { NewAnimal1 } from "../../Routes/Animals";
import { SliderWithInputFormControl } from "../Utils";
import axios from "axios";

const Edit = ({ animal_id }) => {
  const [close, setClose] = useState(true);
  const [animalInfo, setAnimalInfo] = useState("");

  const _edit = useSelector((state) => state.nessesary.edit);
  const dispatch = useDispatch();
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

  const fileTypes = /image\/(png|jpg|jpeg)/i;
  console.log(animalInfo);
  function file_handler(e) {
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
      console.log(img);
      const canvas = document.createElement("canvas");
      console.log(canvas);
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
      console.log(resizedImageFile);
      console.log(resizedImage);
      img.src = URL.createObjectURL(file);
    }
  };

  const updateEnimalInfo = {
    species: animalInfo.species,
    sex: animalInfo.sex,
    breed_id: animalInfo.breed_id,
    tag_id: animalInfo.tag_id,
    rfid_code: animalInfo.rfid_code,
    age_year: animalInfo.age_year,
    age_month: animalInfo.age_month,
    age_year_from: animalInfo.age_year_from,
    age_month_from: animalInfo.age_month_from,
    age_year_to: animalInfo.age_year_to,
    age_month_to: animalInfo.age_month_to,
    name: animalInfo.name,
    description: animalInfo.description,
    medias: [
      {
        url: "string",
        type: "image",
        uploaded_by_user_id: localStorage.getItem("_id"),
        date: new Date().toLocaleString(),
        description: "string",
        animal_id: animalInfo.id,
      },
    ],
    latitude: animalInfo.latitude,
    longitude: animalInfo.longitude,
    address: animalInfo.address,
    history: [
      {
        animal_id: animalInfo.id,
        history_type: "string",
        user_id: localStorage.getItem("_id"),
        health_scale: 0,
        description: animalInfo.description,
        date: new Date().toLocaleString(),
        media_link: "string",
        autocheck: true,
      },
    ],
  };
  function submit_handler(e) {
    console.log("submit");
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .put(
        `http://localhost:8000/api/v1/animal/update/${animalInfo.id}`,
        updateEnimalInfo,
        config
      )
      .then((response) => {
        console.log(response);
        // uploadFile(selected_file, response.data.upload_url);
        // uploadFile(resizedImageFile, response.data.upload_url_icon);
        // alert("New animal created successfully");
        // setCreateAnimalModalShow(false);
        // window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to create new animal");
      });
  }

  useEffect(() => {
    const params = new URLSearchParams({
      animal_id: animal_id,
    });
    fetch(`http://localhost:8000/api/v1/animal/animal?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAnimalInfo(data));
  }, []);
  return (
    <div>
      <Modal
        // className="mt-36"
        show={_edit || false}
        fullscreen={true}
        onHide={false}
      >
        <Modal.Header>
          <Modal.Title>
            <p
              className=" cursor-pointer"
              onClick={() => dispatch(editStateAction({ bool: null }))}
            >
              X
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                setAnimalInfo({ ...animalInfo, description: e.target.value });
              }}
              as="textarea"
              rows={2}
              value={animalInfo.description}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
            <Form.Label>Specie</Form.Label>
            <Form.Control
              onChange={(e) => {
                setAnimalInfo({ ...animalInfo, species: e.target.value });
              }}
              as="select"
            >
              <option selected> {animalInfo.species}</option>
              <option value={"dog"}>Dog</option>
              <option value={"cat"}>Cat</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => {
                setAnimalInfo({ ...animalInfo, sex: e.target.value });
              }}
            >
              <option selected> {animalInfo.sex}</option>
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
                setAnimalInfo({ ...animalInfo, bread: e.target.value });
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
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea5"
            >
              <Form.Label>Age</Form.Label>

              <Form key={"age_month_comp"}>
                <Form.Group as={Row}>
                  <Col xs="9">
                    <Form.Label>{"Age Month"}</Form.Label>
                    <Form.Range
                      value={animalInfo.age_month}
                      max={"12"}
                      onChange={(e) => {
                        setAnimalInfo({
                          ...animalInfo,
                          age_month: parseInt(e.target.value),
                        });
                      }}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Text id={"age_month_comp" + "_value"}>
                      {animalInfo.age_month}
                    </Form.Text>
                  </Col>
                </Form.Group>
              </Form>

              <Form key={"age_year_comp"}>
                <Form.Group as={Row}>
                  <Col xs="9">
                    <Form.Label>{"Age Year"}</Form.Label>
                    <Form.Range
                      value={animalInfo.age_year}
                      max={"12"}
                      onChange={(e) => {
                        setAnimalInfo({
                          ...animalInfo,
                          age_year: parseInt(e.target.value),
                        });
                      }}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Text id={"age_year_comp" + "_value"}>
                      {animalInfo.age_year}
                    </Form.Text>
                  </Col>
                </Form.Group>
              </Form>
            </Form.Group>
          ) : (
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea6"
            >
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
                    setAnimalInfo({
                      ...animalInfo,
                      tag_id: e.target.value,
                    });
                  }}
                  placeholder={animalInfo.tag_id}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea8"
              >
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setAnimalInfo({
                      ...animalInfo,
                      rfid_code: e.target.value,
                    });
                  }}
                  placeholder={animalInfo.rfid_code}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea9"
              >
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setAnimalInfo({
                      ...animalInfo,
                      name: e.target.value,
                    });
                  }}
                  placeholder={animalInfo.name}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea10"
              >
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setAnimalInfo({
                      ...animalInfo,
                      address: e.target.value,
                    });
                  }}
                  placeholder={animalInfo.address}
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
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Edit;
