/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "solid-toast";

const root = document.getElementById("root");

render(
  () => (
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  ),
  root!
);
