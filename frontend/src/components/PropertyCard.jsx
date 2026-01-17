import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";

// 🖼️ Importar imágenes locales
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

// 🔗 Mapeo entre nombre en la BD y archivo local
const images = {
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

export default function PropertyCard({ property }) {
  // 🪄 Corrige rutas tipo "/media/casa1.jpg" → "casa1.jpg"
  const fileName = property.image ? property.image.split("/").pop() : "casa1.jpg";
  const propertyImage = images[fileName] || images["casa1.jpg"];


  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={propertyImage}
        alt={property.title}
        sx={{
          height: 220,
          width: "100%",
          objectFit: "cover",
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {property.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.type}
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 1, fontWeight: "bold", color: "#1E40AF" }}
        >
          ${property.price.toLocaleString()}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button
          component={Link}
          to={`/properties/${property.id}`}
          size="small"
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Ver detalle
        </Button>
      </CardActions>
    </Card>
  );
}
