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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  // 🚀 Función para cargar datos del perfil y favoritos
  const fetchData = async () => {
    try {
      console.log("📡 Cargando perfil y favoritos...");
      // 1️⃣ Perfil
      const userRes = await axios.get("http://localhost:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      // 2️⃣ Favoritos
      const favRes = await axios.get("http://localhost:8000/api/favorites/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("💖 Favoritos recibidos:", favRes.data);

      const favProperties = favRes.data.map((fav) => fav.property);
      setFavorites(favProperties);
    } catch (err) {
      console.error("❌ Error al cargar perfil o favoritos:", err);
      setError("Debes iniciar sesión para acceder a tu perfil.");
      navigate("/login");
    }
  };

  // 🚀 Cargar perfil y favoritos + escuchar cambios globales
  useEffect(() => {
    if (!token) {
      setError("Debes iniciar sesión para acceder a tu perfil.");
      navigate("/login");
      return;
    }

    fetchData();

    // 👂 Escuchar evento global "favoritesChanged"
    const handleFavoritesChanged = () => {
      console.log("🔁 Evento favoritesChanged detectado, recargando...");
      fetchData();
    };

    window.addEventListener("favoritesChanged", handleFavoritesChanged);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChanged);
    };
  }, []); // solo una vez al montar

  // 🔓 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("tokenChanged")); // notificar al Navbar
    navigate("/login");
  };

  // ⏳ Estados de carga o error
  if (error) {
    return (
      <Typography
        variant="h6"
        sx={{ mt: 10, textAlign: "center", color: "error.main" }}
      >
        {error}
      </Typography>
    );
  }

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
                    property.image_url
                      ? property.image_url
                      : property.image
                      ? property.image.startsWith("http")
                        ? property.image
                        : `http://localhost:8000${property.image}`
                      : "/placeholder.jpg"
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
                    ${property.price?.toLocaleString()}
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
