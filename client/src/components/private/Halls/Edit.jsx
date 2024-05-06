import React, { useContext, useEffect, useState } from "react";
import payTypesApi from "../../../utils/Api/private/payTypesApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { Button, Card, Form } from "react-bootstrap";
import hallsApi from "../../../utils/Api/private/hallsApi";
import toBase64 from "../../../utils/toBase64";
import HallScheme from "../../HallScheme/HallScheme";

export default function Edit() {
  const [data, setData] = useState({});
  const [places, setPlaces] = useState([]);
  const appl = useContext(ApplContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      hallsApi
        .getHall(urlParams.get("id"))
        .then(({ hall, places }) => {
          setData(hall);
          setPlaces(places);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    if (urlParams.has("id")) {
      hallsApi
        .editHall(data)
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      hallsApi
        .createHall(data)
        .then(({ newHall, hall_places }) => {
          setData(newHall);
          setPlaces(hall_places);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  };

  const onDelete = () => {
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    hallsApi
      .deleteHall(urlParams.get("id"))
      .then(({ pay_type }) => {})
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const analyzeScheme = ({ scheme_file, scheme_file_name }) => {
    appl.setLoading(true);
    hallsApi
      .preCreateHall({ scheme_file, scheme_file_name })
      .then(({ file_name }) => {
        setData({ ...data, file_name });
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <Card>
      <Card.Header>{data.name ? data.name : "Редактирование зала"}</Card.Header>
      <Card.Body>
        <Form onSubmit={(e) => onSubmit(e)}>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите название"
              value={data.name}
              onChange={(e) => onChange(e)}
              name="name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Адрес</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите адрес"
              value={data.address}
              onChange={(e) => onChange(e)}
              name="address"
            />
          </Form.Group>
          {!data._id ? (
            <Form.Group className="mb-3">
              <Form.Label>Схема зала</Form.Label>
              <Form.Control
                type="file"
                accept="image/svg+xml"
                onChange={async (e) => {
                  const base64 = await toBase64(e.target.files[0]);
                  setData({
                    ...data,
                    scheme_file: base64,
                    scheme_file_name: e.target.files[0].name,
                  });
                  analyzeScheme({
                    scheme_file: base64,
                    scheme_file_name: e.target.files[0].name,
                  });
                }}
              />
            </Form.Group>
          ) : (
            ""
          )}
          {data.scheme ? <HallScheme places={places} hall={data} /> : ""}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-4"
              onClick={() => navigator("/adm/halls/list")}
            >
              Назад
            </Button>
            <Button
              variant="danger"
              className="me-4"
              onClick={() => onDelete()}
            >
              Удалить
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
