import React, { useContext, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
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
      <Card.Body style={{minHeight: '70vh'}}>
        {events.map((event) => (
          <ListGroup.Item
            key={event._id}
            action
            onClick={() => navigator("/event/" + event._id)}
          >
            <div>
              <p className="fw-bold fs-4 mb-1">
                {event.name} –{" "}
                {new Date(event.date).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                {halls.find((el) => el._id === event.hall_id)?.name}
                {"  |  "}
                {halls.find((el) => el._id === event.hall_id)?.address}
              </p>
            </div>
          </ListGroup.Item>
        ))}
      </Card.Body>
    </Card>
  );
}
