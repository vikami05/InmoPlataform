import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { Search } from "@mui/icons-material";

export default function Filters({ onFilterChange }) {
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRooms, setSelectedRooms] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const propertyTypes = ["Casa", "Departamento", "PH"];
  const roomOptions = ["1", "2", "3", "4+"];

  const handleApplyFilters = () => {
    onFilterChange({
      location,
      type: selectedType,
      rooms: selectedRooms,
      maxPrice: selectedPrice,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {/* Título con icono de lupa */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
        <Box
          sx={{
            bgcolor: "#E5E7EB",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Search sx={{ color: "black", fontSize: 22 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            display: { xs: "none", md: "block" },
          }}
        >
          Buscador
        </Typography>
      </Box>

      {/* Ubicación */}
      <TextField
        label="Ubicación"
        variant="outlined"
        size="small"
        sx={{ flex: 1, minWidth: 160 }}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Tipo de propiedad */}
      <FormControl sx={{ flex: 1, minWidth: 160 }} size="small">
        <InputLabel>Tipo de propiedad</InputLabel>
        <Select
          value={selectedType}
          label="Tipo de propiedad"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          {propertyTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Habitaciones */}
      <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
        <InputLabel>Habitaciones</InputLabel>
        <Select
          value={selectedRooms}
          label="Habitaciones"
          onChange={(e) => setSelectedRooms(e.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {roomOptions.map((room) => (
            <MenuItem key={room} value={room}>
              {room}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Precio máximo */}
      <TextField
        label="Precio máximo"
        type="number"
        placeholder="$"
        variant="outlined"
        size="small"
        sx={{ flex: 1, minWidth: 140 }}
        value={selectedPrice}
        onChange={(e) => setSelectedPrice(e.target.value)}
      />

      {/* Botón aplicar */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          minWidth: 150,
          height: 40,
          textTransform: "none",
          fontWeight: 500,
        }}
        onClick={handleApplyFilters}
      >
        Aplicar
      </Button>
    </Box>
  );
}