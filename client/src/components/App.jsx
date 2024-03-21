import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Adm from "./private/Adm";
import Main from "./public/Main";
import "../styles/App.scss";
import { ApplContext } from "../utils/Contexts/ApplContext";
import Loading from "./Loading";
import Error from "./Error";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = createBrowserRouter([
    {
      path: "/adm/*",
      element: <Adm />,
    },
    {
      path: "/*",
      element: <Main />,
    },
  ]);
  return (
    <ApplContext.Provider value={(setError, setLoading)}>
      {loading ? <Loading /> : ""}
      <Error error={error} setError={setError} />
      <RouterProvider router={router} />
    </ApplContext.Provider>
  );
}
