import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PropertyDetail from "./pages/PropertyDetail";
import ContactarAgente from "./pages/ContactarAgente"; // 👈 NUEVO
import { Routes, Route } from "react-router-dom";
import MiniChat from "./components/MiniChat";

export default function App() {
  return (
    <>
      {/* Navbar global */}
      <Navbar />

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route
          path="/contactar-agente/:propiedadId"
          element={<ContactarAgente />}
        />
      </Routes>

      {/* 🔹 Mini Chat disponible en todas las páginas */}
      <MiniChat />
    </>
  );
}