import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app/App";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <ToastContainer
            newestOnTop={true}
            closeOnClick
            draggable
        />
        <App />
    </BrowserRouter>,
);
