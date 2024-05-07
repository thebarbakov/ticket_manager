import React, { useContext, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import eventsApi from "../../utils/Api/public/eventsApi";
import { ApplContext } from "../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [halls, setHalls] = useState([]);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();

  useEffect(() => {
    appl.setLoading(true);
    eventsApi
      .getEvents()
      .then(({ events, halls }) => {
        setEvents(events);
        setHalls(halls);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);
  return (
    <Card className="m-3">
      <Card.Header>
        <h1>Список мероприятий</h1>
      </Card.Header>
      <Card.Body className="d-flex flex-wrap" style={{ minHeight: "70vh", gap: 15 }}>
        {events.map((event) => (
          <Card style={{ width: "18rem" }}>
            {event.image ? <Card.Img variant="top" src={"api/assets/events_posters/" + event.image}/> : <div className="card-img-top bg-primary" style={{height: 152}}/>}
            <Card.Body>
              <Card.Title>{event.name}</Card.Title>
              <br />
              <Card.Subtitle>
                {new Date(event.date).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" | "}
                {halls.find((el) => el._id === event.hall_id)?.name}
              </Card.Subtitle>
              <br />
              <Card.Text>{event.description}</Card.Text>
              <Button
                variant="secondary"
                onClick={() => navigator("/event/" + event._id)}
              >
                Купить билеты
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
}
