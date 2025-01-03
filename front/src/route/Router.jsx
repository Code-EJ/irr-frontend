import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRoutes, privateRoutes } from "./RoutesList";
import { apiClient, getToken } from "../services/ApiClient";
import { deleteToken } from "../services/AuthServices";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AppRouter = () => {
  // Rotas se tornam publicas no inicio
  const [routes, setRoutes] = useState(publicRoutes);
  const [validToken, setValidToken] = useState(false); // Significa q a validaçao ocorreu

  // Checa se o usuario e valido pelo token
  // Se é válido, troca as rotas para privadas
  const checkUserIsValid = async () => {
    try {
      await apiClient.post("/login/validate", {
        login: getToken(),
      });
      setRoutes(privateRoutes);
    } catch (err) {
      deleteToken();
      setRoutes(publicRoutes);
    }
    setValidToken(true);
  };

  useEffect(() => {
    checkUserIsValid();
  }, []);

  // Enquanto as rotas nao validaram, mantém um Skeleton
  // Depois que validaram, setam as rotas
  if (validToken) {
    if (routes == privateRoutes) {
      return (
        <>
        <Header />
          <RouterProvider router={routes} />
        <Footer />
        </>
      )
    } else {
      return (
        <>
        <RouterProvider router={routes} />
        <Footer />
        </>
      )
    }
    
  } else {
    return <>loading...</>;
  }
};

export default AppRouter;
