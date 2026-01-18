import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, MenuItem, Paper, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

// Función para leer cookie CSRF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const ContactarAgente = () => {
  const { propiedadId } = useParams();
  const navigate = useNavigate();

  const [agentes, setAgentes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
    agenteId: "",
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 🔹 Simulación de agentes (puede venir luego del backend)
    const agentesMock = [
      { id: 1, nombre: "María López" },
      { id: 2, nombre: "Juan Pérez" },
      { id: 3, nombre: "Lucía Fernández" },
    ];
    setAgentes(agentesMock);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🚀 Enviar consulta al backend Django
      const response = await axios.post(
        "/api/consultas/",
        {
          nombre: formData.nombre,
          email: formData.email,
          mensaje: formData.mensaje,
          agente: formData.agenteId,
          propiedad: propiedadId,
        },
        {
          withCredentials: true, // ⚡ importante para enviar cookies HttpOnly
          headers: {
            "X-CSRFToken": getCookie("csrftoken"), // ⚡ requerido por Django
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);
      setSuccess(true);
      setErrorMsg("");

      // Limpiar campos del formulario
      setFormData({
        nombre: "",
        email: "",
        mensaje: "",
        agenteId: "",
      });
    } catch (error) {
      console.error("❌ Error al enviar la consulta:", error.response?.data || error);
      setSuccess(false);
      setErrorMsg(
        "❌ Ocurrió un error al enviar la consulta. Verificá los datos e intentá nuevamente."
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#f5f7fa",
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            mt: 18,
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#1E40AF" }}
          >
            Contactar Agente
          </Typography>

          {/* Mensajes de estado */}
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2, textAlign: "center" }}
              onClose={() => setSuccess(false)}
            >
              ✅ ¡Tu mensaje ha sido enviado al agente seleccionado!
            </Alert>
          )}
          {errorMsg && (
            <Alert
              severity="error"
              sx={{ mb: 2, textAlign: "center" }}
              onClose={() => setErrorMsg("")}
            >
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              select
              fullWidth
              label="Seleccionar agente"
              name="agenteId"
              value={formData.agenteId}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="">-- Elegí un agente --</MenuItem>
              {agentes.map((agente) => (
                <MenuItem key={agente.id} value={agente.id}>
                  {agente.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              margin="normal"
              placeholder="Escribí tu consulta..."
              required
            />

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Enviar mensaje
              </Button>
            </Box>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 3,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate(-1)}
          >
            ← Volver a la propiedad
          </Typography>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default ContactarAgente;
