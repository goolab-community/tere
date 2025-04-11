import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { API_URL } from "../config";

function Lightbox({ images, onClose }) {

  return (<div>
    
  </div>);
}

const AnimalDetail = () => {
  const { animalId } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mediaUrls, setMediaUrls] = useState([]);
  const [animalIcon, setAnimalIcon] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await fetch(
          `${API_URL}/animal/animal?animal_id=${animalId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setAnimal(data);
          if (data.medias && data.medias.length > 0) {
            const fetchUrls = async () => {
              const urls = await Promise.all(
                (data.medias || []).map(async (media) => {
                  try {
                    const res = await fetch(
                      `${API_URL}/animal/media/${media.id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );

                    if (!res.ok) {
                      console.error(
                        `Failed to fetch media ${media.id}: ${res.status}`
                      );
                      return null;
                    }

                    const json = await res.json();
                    console.log(`Media ${media.id} response:`, json.media);

                    if (media.type === "image" && json.media.url) {
                      return json.media.url || null;
                    }
                    if (media.type === "icon" && json.media.url) {
                      setAnimalIcon(json.media.url);
                    } else {
                      console.warn(`Media ${media.id} has no url field`);
                      return null;
                    }
                  } catch (err) {
                    console.error(`Error fetching media ${media.id}:`, err);
                    return null;
                  }
                })
              );
              console.log("Fetched media URLs:", urls);
              setMediaUrls(urls.filter(Boolean));
            };
            fetchUrls();
          }
        } else {
          setError(data.message || "Failed to fetch animal data");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [animalId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  if (!animal)
    return (
      <Alert variant="warning" className="my-3">
        Animal not found.
      </Alert>
    );

  const {
    profile_image,
    name,
    species,
    sex,
    breed_id,
    tag_id,
    rfid_code,
    age_year,
    age_month,
    age_year_from,
    age_month_from,
    age_year_to,
    age_month_to,
    description,
    latitude,
    longitude,
    address,
    medias,
  } = animal;

  const formatAge = () => {
    if (age_year !== null && age_month !== null) {
      return `${age_year} years ${age_month} months`;
    } else if (
      age_year_from !== null &&
      age_month_from !== null &&
      age_year_to !== null &&
      age_month_to !== null
    ) {
      return `Estimated: ${age_year_from}y ${age_month_from}m – ${age_year_to}y ${age_month_to}m`;
    }
    return "Unknown";
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow">
            {animalIcon && (
              <Card.Img
                variant="top"
                src={animalIcon}
                alt={name}
                style={{
                  maxWidth: "400px", // or whatever max size feels right
                  width: "100%", // keeps it responsive
                  height: "auto",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )}
            <Card.Body>
              <Card.Title className="mb-3">
                {name || "Unnamed Animal"}
              </Card.Title>
              <Card.Text>{description || "No description provided."}</Card.Text>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <strong>Species:</strong> {species}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Sex:</strong> {sex || "Unknown"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Breed:</strong> {breed_id || "Unknown"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Tag ID:</strong> {tag_id || "N/A"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>RFID Code:</strong> {rfid_code || "N/A"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Age:</strong> {formatAge()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Location:</strong>{" "}
                  {address ? (
                    address
                  ) : (
                    <a
                      href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {latitude}, {longitude}
                    </a>
                  )}
                </ListGroup.Item>
              </ListGroup>

              <h5>Media</h5>
              {mediaUrls.length ? (
                <Row className="g-2 mb-3">
                  {mediaUrls.map((url, idx) => (
                    <Col xs={6} md={4} key={idx}>
                      <img
                        src={url}
                        alt={`Media ${idx + 1}`}
                        className="img-fluid rounded"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No media available.</p>
              )}

              <h5>History</h5>
              {/*history.length ? (
                <ul>
                  {history.map((entry, idx) => (
                    <li key={idx}>
                      {entry.event || "Unknown event"} on{" "}
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No history available.</p>
              )*/}

              <div className="text-end">
                <Button variant="secondary" href="/map" className="mt-3">
                  Back to map
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnimalDetail;
