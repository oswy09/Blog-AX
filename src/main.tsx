import { createRoot } from "react-dom/client";
import { Router } from "./app/router";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);
