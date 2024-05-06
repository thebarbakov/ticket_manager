import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Adm from "./private/Adm";
import Main from "./public/Main";
import "../styles/App.scss";
import { ApplContext } from "../utils/Contexts/ApplContext";
import Loading from "./Loading";
import Error from "./Error";
import configApi from "../utils/Api/public/configApi";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({});
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

  useEffect(() => {
    configApi
      .getInitConfig()
      .then(({ config }) => setConfig(config))
      .catch((err) => {
        if (err.message) setError(err.message);
      });
  }, []);
  return (
    <ApplContext.Provider value={{ setError, setLoading, config }}>
      {loading ? <Loading /> : ""}
      <Error error={error} setError={setError} />
      <RouterProvider router={router} />
    </ApplContext.Provider>
  );
}
