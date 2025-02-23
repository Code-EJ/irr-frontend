import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./RoutesList";
import { apiClient, getToken } from "../config/security/ApiClient";
import { deleteToken } from "../config/security/AuthService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackgroundImage from "../components/BackgroundImage";

const AppRouter = () => {
  // Rotas se tornam publicas no inicio
  const [routes, setRoutes] = useState(publicRoutes);
  const [validToken, setValidateToken] = useState(false); // Significa q a validaçao ocorreu

  // Checa se o usuario e valido pelo token
  // Se é válido, troca as rotas para privadas
  const checkUserIsValid = async () => {
    // try {
    //   await apiClient.post("/login/validate", {
    //     login: getToken(),
    //   });
    //   setRoutes(privateRoutes);
    // } catch (err) {
    //   deleteToken();
    //   setRoutes(publicRoutes);
    // }
    if (getToken()) {
      setRoutes(privateRoutes)
    }
    else {
      // setRoutes(publicRoutes)
      setRoutes(privateRoutes)
    }
    setValidateToken(true);
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
        <BackgroundImage>
          
          <RouterProvider router={routes} />
        </BackgroundImage>
        <Footer />
        </>
      )
    } else {
      return (
        <>
        <BackgroundImage>

        <RouterProvider router={routes} />
        </BackgroundImage>
        <Footer />
        </>
      )
    }
    
  } else {
    return <>loading...</>;
  }
};

export default AppRouter;
