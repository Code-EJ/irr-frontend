import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AppRouter from "./route/Router";
import React from "react";

function App() {
  return (
    <div className="w-screen h-screen">
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          />
    </div>
  );
}

export default App;
