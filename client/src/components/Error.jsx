import React from "react";
import { Toast } from "react-bootstrap";

export default function Error({ error, setError }) {
  return (
    <Toast
      show={Boolean(error)}
      onClose={() => setError(null)}
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
      }}
    >
      <Toast.Header>
        <strong className="text-danger">Ошибка</strong>
      </Toast.Header>
      <Toast.Body>{error}</Toast.Body>
    </Toast>
  );
}
