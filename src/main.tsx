import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import "./main.css";

const queryClient = new QueryClient();
const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <ToastContainer newestOnTop={true} closeOnClick draggable />
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <App />
                <ReactQueryDevtools />
            </HelmetProvider>
        </QueryClientProvider>
    </BrowserRouter>,
);
