import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import Field from "../Field/Field";

export default function Filters({ filter, setFilter, getData, config }) {
  const onSubmit = (e) => {
    e.preventDefault();
    getData();
  };

  const onChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <Card.Header>Фильтр</Card.Header>
      <Card.Body>
        <Form onSubmit={(e) => onSubmit(e)}>
          {config
            ?.filter((el) => el.isFilter)
            .map((filter, index) => (
              <Field
                key={index}
                field={filter}
                onChange={onChange}
                value={filter[filter.field]}
              />
            ))}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary me-4"
              onClick={() => {
                setFilter({
                  p: 1,
                  s: 20,
                });
                getData();
              }}
            >
              Очистить
            </Button>
            <Button variant="primary" onClick={() => getData()} type="submit">
              Фильтровать
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
