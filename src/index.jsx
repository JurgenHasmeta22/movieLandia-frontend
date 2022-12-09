import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app/App";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);
