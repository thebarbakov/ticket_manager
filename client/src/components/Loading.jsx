import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "rgba(255,255,255,0.4)",
      }}
    >
      <Spinner animation="grow" variant="secondary" />
      <p className="mt-2">Загрузка...</p>
    </div>
  );
}
