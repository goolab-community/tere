import Modal from "react-bootstrap/Modal";
import { Card, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";

const Edit = ({ animal_id }) => {
  const [close, setClose] = useState(true);
  const [animalInfo, setAnimalInfo] = useState("");
  console.log(animalInfo.description);

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
        show={close}
        fullscreen={true}
        onHide={false}
      >
        <Modal.Header>
          <Modal.Title>
            <p className=" cursor-pointer" onClick={() => setClose(false)}>
              X
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea4">
            <div>aqedan daviwyeb damatebas</div>
            <Form.Label>Event Type</Form.Label>
            <Form.Control
              as="select"
              placeholder="Event Type"
              // onChange={(e) => {
              //   setEventType(e.target.value);
              // }}
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
            {/* <SliderWithInputFormControl
              id="health_scale"
              name="Health Scale"
              value={""}
              min="0"
              max="10"
              setValue={""}
            /> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
            <Form.Label>Date</Form.Label>
            <p></p>
            <input
              type="datetime-local"
              id="eventdate"
              name="eventdate"
              // onChange={(e) => setEventDate(e.target.value)}
            ></input>
            <p></p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={animalInfo.description}
              // onChange={(e) => setEventDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
            <Form.Label>Media</Form.Label>
            <Card.Img src={""} />
            <Form.Group
              style={{ marginTop: "10px" }}
              controlId="formFile"
              className="mb-3"
            >
              <Form.Control onChange={""} type="file" />
            </Form.Group>
            <Button className="mr-3" variant="secondary" onClick={""}>
              Close
            </Button>
            <Button variant="primary" onClick={""}>
              Save Changes
            </Button>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>{" "}
    </div>
  );
};

export default Edit;
