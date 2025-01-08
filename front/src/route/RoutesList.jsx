import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ManageUsers from "../pages/ManagementUsers";

// Aqui ficarão as rotas que podem ser acessada SEM LOGAR
export const publicRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
]);

// Aqui ficarão as rotas que podem ser acessadas SOMENTE LOGADO
export const privateRoutes = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
  {
    path: "/management-users",
    element: <ManageUsers />,
  }
]);
