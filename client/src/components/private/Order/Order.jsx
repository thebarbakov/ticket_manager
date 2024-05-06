import React from "react";
import { Route, Routes } from "react-router-dom";
import List from "./List";
import Edit from "./Edit";
import New from "./New";

export default function Order() {
  return (
    <Routes>
      <Route path="/list" element={<List />} />
      <Route path="/edit" element={<Edit />} />
      <Route path="/new" element={<New />} />
    </Routes>
  );
}
