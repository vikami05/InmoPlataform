import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage1 from "../assets/casa7.jpg";
import heroImage2 from "../assets/hero2.jpg";
import heroImage3 from "../assets/hero3.jpg";

const images = [heroImage1, heroImage2, heroImage3];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [openRegister, setOpenRegister] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 🖼️ Cambio automático de fondo
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 Validación en vivo
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "nombre":
      case "apellido":
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
          message = "Solo letras permitidas";
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = "Formato de email inválido";
        }
        break;
      case "password":
        if (value.length > 0 && value.length < 6) {
          message = "Debe tener al menos 6 caracteres";
        }
        break;
      case "confirmPassword":
        if (value !== form.password) {
          message = "Las contraseñas no coinciden";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // ✏️ Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // 🚀 Envío al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" });
      return;
    }

    try {
      // 1️⃣ Registro del usuario
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          email: form.email,
          password: form.password,
          confirm_password: form.confirmPassword,
          nombre: form.nombre,
          apellido: form.apellido,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2️⃣ Intentar login automático tras registro
        const loginRes = await fetch("http://127.0.0.1:8000/api/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.email,
            password: form.password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          alert("✅ Registro exitoso. Redirigiendo a tu perfil...");
          // Guardar token temporalmente
          window.sessionToken = loginData.token;

          setOpenRegister(false);
          setForm({
            nombre: "",
            apellido: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
          navigate("/profile");
        } else {
          alert("✅ Registro exitoso. Ahora iniciá sesión para continuar.");
          setOpenRegister(false);
          navigate("/login");
        }
      } else {
        // Errores devueltos por el backend
        const backendErrors = {};
        Object.keys(data).forEach((key) => {
          backendErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        });
        setErrors(backendErrors);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <Box sx={{ height: "90vh", position: "relative", overflow: "hidden" }}>
      {/* 🌅 Imágenes de fondo en fade */}
      {images.map((img, i) => (
        <Box
          key={i}
          sx={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transition: "opacity 2s ease-in-out",
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}

      {/* 🌓 Capa oscura */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      />

      {/* 🏠 Contenido principal */}
      <Container
        sx={{
          color: "white",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1" gutterBottom>
          Encuentra tu hogar ideal
        </Typography>
        <Typography variant="h5" gutterBottom>
          Explora, guarda y contacta propiedades fácilmente
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2, "&:hover": { backgroundColor: "#1E40AF" } }}
            onClick={() => navigate("/properties")}
          >
            Buscar Propiedades
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ "&:hover": { backgroundColor: "#1E40AF" } }}
            onClick={() => setOpenRegister(true)}
          >
            Registrarse
          </Button>
        </Box>
      </Container>

      {/* 🧾 Modal de registro */}
      <Dialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 3 } }}
      >
        <DialogContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2 }}>
            ¡Bienvenido a InmoPlatform!
          </Typography>
          <Typography variant="body1" align="center" gutterBottom sx={{ mb: 3 }}>
            Crea tu cuenta para guardar tus propiedades favoritas y mucho más
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.nombre}
              helperText={errors.nombre}
            />

            <TextField
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.apellido}
              helperText={errors.apellido}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
            />

            <TextField
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              Registrarse
            </Button>
            <Button onClick={() => setOpenRegister(false)} sx={{ mt: 1 }}>
              Cancelar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
