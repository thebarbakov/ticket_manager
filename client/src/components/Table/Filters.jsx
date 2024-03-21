import React from "react";
import { Card, FloatingLabel, Form } from "react-bootstrap";

export default function Filters({ filter, setFilter, getData }) {
  const onSubmit = () => {
    getData();
  };

  const onChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <Card.Header>Фильтр</Card.Header>
      <Card.Body>
        <Form onSubmit={(e) => console.log(e)}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
            <FloatingLabel label="Password">
              <Form.Control type="password" placeholder="Password" />
            </FloatingLabel>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
