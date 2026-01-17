import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Verifica si ya hay sesión activa
  useEffect(() => {
    axios
      .get("https://inmoplataform-backend.onrender.com/api/me/", { withCredentials: true })
      .then(() => navigate("/profile")) // Si hay cookie válida, va directo al perfil
      .catch(() => {}); // no logueado, no hacer nada
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "https://inmoplataform-backend.onrender.com/api/login/",
        { email, password },
        { withCredentials: true } // ⚡ importante para recibir la cookie HttpOnly
      );

      // Login exitoso: redirigir a perfil
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos");
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
