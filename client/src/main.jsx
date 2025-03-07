import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Import createRoot from ReactDOM
import App from "./App.jsx";
import "./App.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
