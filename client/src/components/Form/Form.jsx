import React, { useContext } from "react";
import { Button, Card, Form as BootstrapForm } from "react-bootstrap";
import Field from "../Field/Field";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/Contexts/UserContext";

export default function Form({
  config,
  data,
  onSubmit,
  setData,
  title,
  onDelete,
  back_href,
  children,
  me,
}) {
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const navigator = useNavigate();
  const userContext = useContext(UserContext);

  return (
    <Card>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <BootstrapForm onSubmit={(e) => onSubmit(e)}>
          {config &&
            config.map((field) => (
              <Field
                field={field}
                onChange={onChange}
                value={data[field.field]}
              />
            ))}
          {children}
          <div className="d-flex justify-content-end">
            {!me ? (
              <Button
                variant="secondary"
                className="me-4"
                onClick={() => navigator(back_href)}
              >
                Назад
              </Button>
            ) : (
              ""
            )}

            {userContext.access.is_root & !me ? (
              <Button
                variant="danger"
                className="me-4"
                onClick={() => onDelete()}
              >
                Удалить
              </Button>
            ) : (
              ""
            )}

            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </BootstrapForm>
      </Card.Body>
    </Card>
  );
}
