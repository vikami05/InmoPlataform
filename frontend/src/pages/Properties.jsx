import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";
import fondo3 from "../assets/fondo3.jpg";

export default function Properties() {
  // Estado para las propiedades
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Cargar datos desde backend al iniciar el componente
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/properties/") // endpoint Django
      .then((res) => {
        setProperties(res.data);
        setFilteredProperties(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Filtrado de propiedades
  const handleFilterChange = ({ location, type, rooms, maxPrice }) => {
    const filtered = properties.filter((prop) => {
      const matchLocation = location
        ? prop.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchType = type ? prop.type === type : true;
      const matchRooms = rooms
        ? rooms === "4+"
          ? prop.rooms >= 4
          : prop.rooms === Number(rooms)
        : true;
      const matchPrice = maxPrice
        ? Number(prop.price) <= Number(maxPrice) // suponiendo que price es número
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
      }}
    >
      <Navbar bgColor="#fff" textColor="#1F2937" />

      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: { xs: 6, md: 10 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={6}
          sx={{ maxWidth: "1400px", width: "100%", alignItems: "flex-start" }}
        >
          {/* Filtros */}
          <Grid item xs={12} md={3}>
            <Filters onFilterChange={handleFilterChange} />
          </Grid>

          {/* Propiedades */}
          <Grid item xs={12} md={9}>
            {filteredProperties.length > 0 ? (
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

      <Footer />
    </Box>
  );
}
