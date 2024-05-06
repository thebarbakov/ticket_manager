import React from "react";
import { Route, Routes } from "react-router-dom";
import List from "./List";
import Edit from "./Edit";

export default function User() {
  return (
    <Routes>
      <Route path="/list" element={<List />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  );
}
