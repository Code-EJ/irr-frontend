import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRoutes, privateRoutes } from "./RoutesList";
import { apiClient, getToken } from "../services/ApiClient";
import { deleteToken } from "../services/AuthServices";

const AppRouter = () => {
  const [routes, setRoutes] = useState(publicRoutes);
  const [validToken, setValidToken] = useState(false); // Significa q a validaçao ocorreu

  const checkUserIsValid = async () => {
    try {
      await apiClient.post("/login/validate", {
        login: getToken(),
      });
      setValidToken(true);
      setRoutes(privateRoutes);
    } catch (err) {
      deleteToken();
      setValidToken(true);
      setRoutes(publicRoutes);
    }
  };

  useEffect(() => {
    checkUserIsValid();
  }, []);
  console.log(validToken, routes);
  if (validToken) {
    return <RouterProvider router={routes} />;
  } else {
    return <>loading...</>;
  }
};

export default AppRouter;
