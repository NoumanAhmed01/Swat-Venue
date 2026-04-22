import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./components/translation/i18n";

createRoot(document.getElementById("root")).render(<App />);
