import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // Import App specific styles

const rootElement = document.getElementById("root");

// Ensure rootElement is not null before proceeding
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
