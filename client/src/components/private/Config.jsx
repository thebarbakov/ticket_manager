import React, { useContext, useEffect, useState } from "react";
import { ApplContext } from "../../utils/Contexts/ApplContext";
import configApi from "../../utils/Api/private/configApi";
import { Button, Card, Form } from "react-bootstrap";

export default function Config() {
  const [data, setData] = useState([]);
  const appl = useContext(ApplContext);
  useEffect(() => {
    appl.setLoading(true);
    configApi
      .getConfig()
      .then(({ config }) => {
        const res = [];
        config.forEach((el) => {
          if (res.find((le) => le.group === el.group)) {
            res.find((le) => le.group === el.group).configs.push(el);
          } else {
            res.push({ group: el.group, configs: [el] });
          }
        });
        setData(res);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  const onChange = (e, group) => {
    setData(
      data.map((el) => {
        if (el.group === group.group) {
          return {
            ...el,
            configs: data
              .find((le) => le.group === group.group)
              .configs.map((le) => {
                if (le.key === e.target.name) {
                  return {
                    ...le,
                    value: e.target.value,
                  };
                } else {
                  return le;
                }
              }),
          };
        } else {
          return el;
        }
      })
    );
  };

  const saveConfig = () => {
    appl.setLoading(true);
    const toSave = [];
    data.forEach((el) => el.configs.forEach((le) => toSave.push(le)));
    configApi
      .updateConfig(toSave)
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <Card>
      <Card.Header>Настройки конфигурации</Card.Header>
      <Card.Body>
        {data.map((group) => (
          <>
            <h4>{group.group}</h4>
            {group.configs.map((config) => (
              <Form.Group className="mb-3">
                <Form.Label>{config.name}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={data
                    .find((el) => el.group === group.group)
                    .configs.find((el) => el.key === config.key).value}
                  onChange={(e) => onChange(e, group)}
                  name={config.key}
                />
              </Form.Group>
            ))}
          </>
        ))}
        <Button onClick={() => saveConfig()}>Сохранить</Button>
      </Card.Body>
    </Card>
  );
}
