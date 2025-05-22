import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRoutes, privateRoutes } from "./RoutesList";
import { getToken } from "../config/security/ApiClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackgroundImage from "../components/BackgroundImage";
import { toast } from "react-toastify";

const AppRouter = () => {

  const [routes, setRoutes] = useState( 
    getToken() ? privateRoutes : publicRoutes
  );

  useEffect(() => {
    const handleLogin = (event: Event) => {
      const customEvent = event as CustomEvent;
      const message = customEvent.detail?.message;

      if (message) {
        console.log("mensagem recebida.", message);
      };
      

      if (getToken()) {
        console.log(getToken())
        setRoutes(privateRoutes);
        console.log(routes === privateRoutes)
        window.location.href = "/menu";
      }

  };

    window.addEventListener("user-logged-in", handleLogin);
    return () =>{
      window.removeEventListener("user-logged-in", handleLogin);
    } 
  }, []);

  return (
    <>
      {routes === privateRoutes && <Header />}
      <BackgroundImage>
        <RouterProvider router={routes} />
      </BackgroundImage>
      <Footer />
    </>
  );
};

export default AppRouter;
