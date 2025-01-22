import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { AppLayout } from "./components/AppLayout";
import App from "./App";
import Login from './routes/Login'
import Home from './routes/Home'

import "./style.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<App />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
