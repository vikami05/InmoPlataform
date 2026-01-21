import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import Filters from "../components/Filters";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";
import fondo3 from "../assets/fondo3.jpg";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  // 🚀 Cargar propiedades al montar
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/properties/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setProperties(res.data);
        setFilteredProperties(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al obtener propiedades:", err);
        setError("No se pudieron cargar las propiedades.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // 🎯 Filtrado de propiedades
  const handleFilterChange = ({ location, type, rooms, maxPrice }) => {
    const filtered = properties.filter((prop) => {
      const matchLocation = location
        ? prop.location?.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchType = type ? prop.type === type : true;
      const matchRooms = rooms
        ? rooms === "4+"
          ? prop.rooms >= 4
          : prop.rooms === Number(rooms)
        : true;
      const matchPrice = maxPrice
        ? Number(prop.price) <= Number(maxPrice)
        : true;

      return matchLocation && matchType && matchRooms && matchPrice;
    });

    setFilteredProperties(filtered);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${fondo3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 📦 Contenido principal */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: { xs: 6, md: 10 },
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={6}
          sx={{ maxWidth: "1400px", width: "100%", alignItems: "flex-start" }}
        >
          {/* 🧩 Filtros */}
          <Grid item xs={12} md={3}>
            <Filters onFilterChange={handleFilterChange} />
          </Grid>

          {/* 🏠 Propiedades */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 2,
                  p: 4,
                }}
              >
                <Typography color="error">{error}</Typography>
              </Box>
            ) : filteredProperties.length > 0 ? (
              <Grid
                container
                spacing={4}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 4,
                  justifyItems: "center",
                  alignItems: "stretch",
                }}
              >
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Lo sentimos, no se encontraron propiedades que coincidan con tu búsqueda.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* 📍 Footer */}
      <Footer />
    </Box>
  );
}
