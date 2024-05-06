import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";

export default function Field({ field, onChange, value }) {
  if (field.type === "select") {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{field.displayName}</Form.Label>
        <Form.Select
          value={value}
          onChange={(e) => onChange(e)}
          name={field.field}
          disabled={field.disabled}
        >
          {field?.source
            ? field?.source?.map((el) => (
                <option value={el._id} key={el._id}>
                  {Array.isArray(field.sourceField)
                    ? field.sourceField.map((le) => {
                        if (el[le]) return el[le] + " ";
                      })
                    : el[field.sourceField]}
                </option>
              ))
            : ""}
        </Form.Select>
      </Form.Group>
    );
  } else if (field.type === "boolean")
    return (
      <Form.Group className="mb-3">
        <Form.Label>{field.displayName}</Form.Label>
        <Form.Select
          value={value}
          onChange={(e) => onChange(e)}
          name={field.field}
          disabled={field.disabled}
        >
          <option>---</option>
          <option value={true}>Да</option>
          <option value={false}>Нет</option>
        </Form.Select>
      </Form.Group>
    );
  else if (field.type === "date") {
    if (field.range) {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>{field.displayName}</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={"date"}
                placeholder={`Введите ${field.displayName.toLowerCase()}`}
                value={new Date(value)}
                onChange={(e) => onChange(new Date(e))}
                name={"f_" + field.field}
                disabled={field.disabled}
              />
              {"  —  "}
              <Form.Control
                type={"date"}
                placeholder={`Введите ${field.displayName.toLowerCase()}`}
                value={value}
                onChange={(e) => onChange(e)}
                name={"t_" + field.field}
                disabled={field.disabled}
              />
            </div>
          </Form.Group>
        </>
      );
    } else {
      return (
        <Form.Group className="mb-3 d-flex flex-column">
          <Form.Label>{field.displayName}</Form.Label>
          <DatePicker
            selected={moment(value).toDate()}
            timeFormat="HH:mm"
            dateFormat="dd.MM.yyyy HH:mm"
            className="form-control"
            disabled={field.disabled}
            onChange={(date) =>
              onChange({ target: { name: field.field, value: date } })
            }
            showTimeInput={field.withTime}
          />
        </Form.Group>
      );
    }
  } else if (field.type === "multy_select") {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{field.displayName}</Form.Label>
        {field?.source
          ? field?.source.map((el) => (
              <Form.Check
                type="checkbox"
                label={el[field.sourceField]}
                checked={value?.find(
                  (le) => le[field.sourceArrayKey] === el._id
                )}
                onChange={() => {
                  if (
                    value?.find((le) => le[field.sourceArrayKey] === el._id)
                  ) {
                    onChange({
                      target: {
                        name: field.field,
                        value: value.filter(
                          (le) => le[field.sourceArrayKey] !== el._id
                        ),
                      },
                    });
                  } else {
                    if (Array.isArray(value)) {
                      onChange({
                        target: {
                          name: field.field,
                          value: [...value, { [field.sourceArrayKey]: el._id }],
                        },
                      });
                    } else {
                      onChange({
                        target: {
                          name: field.field,
                          value: [{ [field.sourceArrayKey]: el._id }],
                        },
                      });
                    }
                  }
                }}
              />
            ))
          : ""}
      </Form.Group>
    );
  } else
    return (
      <Form.Group className="mb-3">
        <Form.Label>{field.displayName}</Form.Label>
        <Form.Control
          type={field.inputType ? field.inputType : "text"}
          placeholder={`Введите ${field.displayName.toLowerCase()}`}
          value={value}
          onChange={(e) => onChange(e)}
          name={field.field}
          disabled={field.disabled}
        />
      </Form.Group>
    );
}
