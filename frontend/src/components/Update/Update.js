import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Card, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { editStateAction } from "../../redux/reducers/nessesaryState";
import { SliderWithInputFormControl, uploadFile } from "../Utils";

import axios from "axios";

const Update = () => {
  const [show, setShow] = useState(false);
  const [event_type, setEventType] = useState("feed");
  const [health_scale, setHealthScale] = useState(0);
  const [event_date, setEventDate] = useState(null);
  const [event_description, setEventDescription] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [selected_file, setSelectedFile] = useState(null);
  const [selected_animal, setSelectedAnimal] = useState(null);

  const handleClose = () => setShow(false);
  const _edit = useSelector((state) => state.nessesary.edit);
  const dispatch = useDispatch();

  const fileTypes = /image\/(png|jpg|jpeg)/i;
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
  function submit_history(e) {
    // handleClose();
    console
      .log
      // `------- Submitting history for animal ${animal.name} --------`
      ();
    console.log("Event Type:", event_type);
    console.log("Health Scale:", health_scale);
    console.log("Date:", event_date);
    console.log("Description:", event_description);
    console.log("File:", selected_file);
    console.log(
      "-------------------------------------------------------------"
    );
    // make a pos request to the backend
    const history = {
      user_id: parseInt(localStorage.getItem("_id")),
      // animal_id: animal.id,
      history_type: event_type,
      health_scale: parseInt(health_scale),
      media_link: "",
      description: event_description,
      date: event_date,
      autocheck: true,
    };

    // const editInfo = {
    //   species: "string",
    //   sex: "string",
    //   breed_id: "string",
    //   tag_id: "string",
    //   rfid_code: "string",
    //   age_year: 0,
    //   age_month: 0,
    //   age_year_from: 0,
    //   age_month_from: 0,
    //   age_year_to: 0,
    //   age_month_to: 0,
    //   name: "string",
    //   description: "string",
    //   medias: [
    //     {
    //       url: "string",
    //       type: "image",
    //       uploaded_by_user_id: 0,
    //       date: "2024-08-06T09:45:40.885Z",
    //       description: "string",
    //       animal_id: 0,
    //     },
    //   ],
    //   latitude: 0,
    //   longitude: 0,
    //   address: "string",
    //   history: [
    //     {
    //       animal_id: animal.id,
    //       history_type: event_type,
    //       user_id: parseInt(localStorage.getItem("_id")),
    //       health_scale: parseInt(health_scale),
    //       description: event_description,
    //       date: event_date,
    //       media_link: "",
    //       autocheck: true,
    //     },
    //   ],
    // };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post("http://localhost:8000/api/v1/history/history", history, config)
      .then((response) => {
        console.log(response);
        uploadFile(selected_file, response.data.upload_url);
        alert("History updated successfully");
        // goto home page
        window.location.href = "/history";
      })
      .catch((error) => {
        console.log(history);
        console.log(error);
        alert("Error updating history");
      });
  }
  return (
    <div>
      <Modal
        // className="mt-36"
        show={!_edit || false}
        fullscreen={true}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>
            {" "}
            <p
              className=" cursor-pointer"
              onClick={() => dispatch(editStateAction({ bool: null }))}
            >
              X
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea4">
            <Form.Label>Event Type</Form.Label>
            <Form.Control
              as="select"
              placeholder="Event Type"
              onChange={(e) => {
                setEventType(e.target.value);
              }}
            >
              <option value={"feed"}>Feed</option>
              <option value={"lost"}>Lost</option>
              <option value={"found"}>Found</option>
              <option value={"sighting"}>Seen</option>
              <option value={"adoption"}>Adopted</option>
              <option value={"death"}>Death</option>
              <option value={"other"}>Other</option>
            </Form.Control>
            <p></p>
            <SliderWithInputFormControl
              id="health_scale"
              name="Health Scale"
              value={health_scale}
              min="0"
              max="10"
              setValue={setHealthScale}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
            <Form.Label>Date</Form.Label>
            <p></p>
            <input
              type="datetime-local"
              id="eventdate"
              name="eventdate"
              onChange={(e) => setEventDate(e.target.value)}
            ></input>
            <p></p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
            <Form.Label>Media</Form.Label>
            <Card.Img src={fileDataURL} />
            <Form.Group
              style={{ marginTop: "10px" }}
              controlId="formFile"
              className="mb-3"
            >
              <Form.Control onChange={(e) => file_handler(e)} type="file" />
            </Form.Group>
            <Button className="mr-3" variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={(a) => submit_history(a)}>
              Save Changes
            </Button>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Update;
