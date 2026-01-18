import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // 🚀 Al montar, cargar perfil y favoritos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Traer perfil del usuario logueado
        const userRes = await axios.get(
          "https://inmoplataform-backend.onrender.com/api/me/",
          {
            withCredentials: true,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
          }
        );
        setUser(userRes.data);

        // 2️⃣ Traer favoritos del usuario
        const favRes = await axios.get(
          "https://inmoplataform-backend.onrender.com/api/favorites/",
          {
            withCredentials: true,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
          }
        );
        const favProperties = favRes.data.map((fav) => fav.property);
        setFavorites(favProperties);
      } catch (err) {
        alert("⚠️ Debes iniciar sesión para acceder a tu perfil.");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  // ⏳ Mientras carga
  if (!user) {
    return (
      <Typography
        variant="h5"
        sx={{ mt: 10, textAlign: "center", color: "#1E40AF" }}
      >
        Cargando perfil...
      </Typography>
    );
  }

  const nombre = user.profile?.nombre || "Usuario";
  const apellido = user.profile?.apellido || "";
  const email = user.email || "sin-email";

  // 🔓 Cerrar sesión
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://inmoplataform-backend.onrender.com/api/logout/",
        {},
        {
          withCredentials: true,
          headers: { "X-CSRFToken": getCookie("csrftoken") },
        }
      );
      navigate("/login");
    } catch (err) {
      console.error("Error logout:", err);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#F3F4F6",
        minHeight: "100vh",
        pt: { xs: 12, md: 14 },
        pb: 4,
        px: { xs: 2, md: 6 },
      }}
    >
      {/* 🧍 Cabecera del perfil */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 6,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#1E40AF",
            width: 80,
            height: 80,
            fontSize: 36,
          }}
        >
          {nombre.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {nombre} {apellido}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          sx={{
            ml: "auto",
            borderColor: "#1E40AF",
            color: "#1E40AF",
            "&:hover": {
              borderColor: "#1E40AF",
              bgcolor: "rgba(30,64,175,0.1)",
            },
          }}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Box>

      {/* 💖 Sección de favoritos */}
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", color: "#1E40AF" }}
      >
        Propiedades Favoritas
      </Typography>

      <Grid container spacing={4}>
        {favorites.length > 0 ? (
          favorites.map((property) => (
            <Grid item xs={12} md={6} lg={4} key={property.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    property.image_url ||
                    `https://inmoplataform-backend.onrender.com${property.image}`
                  }
                  alt={property.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {property.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    ${property.price.toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    Ver propiedad
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ ml: 2 }}>
            Aún no tienes propiedades en favoritos.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
