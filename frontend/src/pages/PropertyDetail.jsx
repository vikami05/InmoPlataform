import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography, Button, Grid, CardMedia } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// 🖼️ Imágenes principales
import casa1 from "../assets/casa1.jpg";
import casa2 from "../assets/casa2.jpg";
import casa3 from "../assets/casa3.jpg";
import casa4 from "../assets/casa4.jpg";
import casa5 from "../assets/casa5.jpg";
import casa6 from "../assets/casa6.jpg";
import casa7 from "../assets/casa8.1.jpg";
import casa8 from "../assets/casa8.jpg";
import casa9 from "../assets/casa9.jpg";
import casa10 from "../assets/casa10.jpg";
import casa11 from "../assets/casa11.jpg";

// 🖼️ Interiores
import interior1 from "../assets/interior1.jpg";
import interior2 from "../assets/interior2.jpg";
import interior3 from "../assets/interior3.jpg";
import interior4 from "../assets/interior4.jpg";
import interior5 from "../assets/interior5.jpg";
import interior6 from "../assets/interior6.jpg";
import interior81 from "../assets/interior81.jpg";
import interior8 from "../assets/interior8.jpg";
import interior9 from "../assets/interior9.jpg";
import interior10 from "../assets/interior10.jpg";
import interior11 from "../assets/interior11.jpg";

const mainImages = {
  "casa1.jpg": casa1,
  "casa2.jpg": casa2,
  "casa3.jpg": casa3,
  "casa4.jpg": casa4,
  "casa5.jpg": casa5,
  "casa6.jpg": casa6,
  "casa7.jpg": casa7,
  "casa8.jpg": casa8,
  "casa9.jpg": casa9,
  "casa10.jpg": casa10,
  "casa11.jpg": casa11,
};

const interiorImages = {
  "casa1.jpg": interior1,
  "casa2.jpg": interior2,
  "casa3.jpg": interior3,
  "casa4.jpg": interior4,
  "casa5.jpg": interior5,
  "casa6.jpg": interior6,
  "casa7.jpg": interior81,
  "casa8.jpg": interior8,
  "casa9.jpg": interior9,
  "casa10.jpg": interior10,
  "casa11.jpg": interior11,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  // 🚀 Traer propiedad
  useEffect(() => {
    axios
      .get(`https://inmoplataform-backend.onrender.com/api/properties/${id}/`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // 🚀 Traer usuario logueado y favoritos
  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const userRes = await axios.get(
          "https://inmoplataform-backend.onrender.com/api/me/",
          { withCredentials: true }
        );
        setUser(userRes.data);

        const favRes = await axios.get(
          "https://inmoplataform-backend.onrender.com/api/favorites/",
          { withCredentials: true }
        );
        const favIds = favRes.data.map((f) => f.property.id);
        setIsFavorite(favIds.includes(Number(id)));
      } catch {
        setUser(null); // no logueado
      }
    };

    fetchUserAndFavorites();
  }, [id]);

  if (!property) {
    return (
      <Typography variant="h5" sx={{ mt: 10, textAlign: "center" }}>
        Cargando propiedad...
      </Typography>
    );
  }

  const fileName = property.image ? property.image.split("/").pop() : "casa1.jpg";
  const mainImage = mainImages[fileName] || mainImages["casa1.jpg"];
  const secondaryImage = interiorImages[fileName] || interior1;

  // 🔄 Agregar / quitar favorito
  const toggleFavorite = async () => {
    if (!user) {
      alert("Debes registrarte o iniciar sesión para guardar esta propiedad ⭐");
      return;
    }

    try {
      const res = await axios.post(
        `https://inmoplataform-backend.onrender.com/api/favorites/${id}/toggle/`,
        {},
        { withCredentials: true }
      );

      if (res.data.status === "added") {
        setIsFavorite(true);
      } else if (res.data.status === "removed") {
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error favoritos:", err);
      alert("⚠️ Error al actualizar favoritos");
    }
  };

  // 👉 Redirigir al formulario de contacto
  const irAContactarAgente = () => {
    navigate(`/contactar-agente/${id}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar bgColor="#fff" textColor="#1F2937" />

      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 8 }, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {[mainImage, secondaryImage].map((img, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <CardMedia
                component="img"
                image={img}
                alt={`Foto ${index + 1}`}
                sx={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 2 }}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 4 }}>
              {property.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {property.location} • {property.type} • {property.rooms} hab.
            </Typography>
            <Typography variant="h5" sx={{ color: "#1E40AF", fontWeight: "bold", mb: 2 }}>
              ${property.price.toLocaleString()}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }}>
              Propiedad disponible para visitas. Contactá con el agente para más detalles.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant={isFavorite ? "contained" : "outlined"}
                color="primary"
                onClick={toggleFavorite}
              >
                {isFavorite ? "❤️ En favoritos" : "Agregar a favoritos"}
              </Button>

              <Button variant="contained" color="primary" onClick={irAContactarAgente}>
                Contactar agente
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}
