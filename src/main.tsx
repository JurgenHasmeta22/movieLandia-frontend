import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import "./main.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <ToastContainer newestOnTop={true} closeOnClick draggable />
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </BrowserRouter>,
);
