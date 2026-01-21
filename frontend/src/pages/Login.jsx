import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  // ✅ Verificar si ya hay sesión activa
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => navigate("/profile")) // Si hay token válido, redirige al perfil
      .catch(() => {
        // Token inválido → no hacer nada
      });
  }, [navigate, token]);

  // 🚀 Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/login/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Guardar token en localStorage
      const accessToken = res.data.access_token;
      localStorage.setItem("access_token", accessToken);

      // 🔔 Notificar al Navbar que el token cambió
      window.dispatchEvent(new Event("tokenChanged"));

      // Redirigir a perfil
      navigate("/profile");
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      setError(
        "Email o contraseña incorrectos o no se pudo conectar al servidor."
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar bgColor="white" textColor="black" />

      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ padding: 1.5, marginTop: 1 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}
