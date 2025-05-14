import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRoutes, privateRoutes } from "./RoutesList";
import { apiClient, getToken } from "../config/security/ApiClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackgroundImage from "../components/BackgroundImage";
import { deleteToken } from "../config/security/Client";
import { API_HOST } from "../consts";

const AppRouter = () => {
  const [routes, setRoutes] = useState(publicRoutes);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    window.addEventListener("user-logged-in", checkUserIsValid);
    return () => window.removeEventListener("user-logged-in", checkUserIsValid);
  }, []);

  
  const checkUserIsValid = async () => {
    const token = getToken();

    if (!token) {
      setRoutes(publicRoutes);
      setIsAuthChecked(true);
      return;
    }

    try {
      // Call your API to validate token
      await apiClient.get(`${API_HOST}/auth/validate-token`); // adjust the endpoint as needed
      setRoutes(privateRoutes);
    } catch (err) {
      deleteToken();
      setRoutes(publicRoutes);
    }

    setIsAuthChecked(true);
  };

  useEffect(() => {
    checkUserIsValid();
  }, []);

  if (!isAuthChecked) {
    return <>Carregando...</>;
  }

  const isPrivate = routes === privateRoutes;

  return (
    <>
      {isPrivate && <Header />}
      <BackgroundImage>
        <RouterProvider router={routes} />
      </BackgroundImage>
      <Footer />
    </>
  );
};

export default AppRouter;
