import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#1F2937",
        color: "#F9FAFB",
        py: 10,
        px: { xs: 4, md: 12 },
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Grid container alignItems="flex-start" justifyContent="space-between">
        {/* Logo / Nombre de la empresa */}
        <Grid item xs={12} md={4} sx={{ mb: { xs: 6, md: 0 } }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 3, letterSpacing: 1 }}
          >
            InmoPlataform
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Conectando personas con su hogar ideal de manera fácil y confiable.
          </Typography>
        </Grid>

        {/* Wrapper de enlaces + redes, alineados a la derecha */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 8, // espacio entre enlaces y redes
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            {/* Enlaces rápidos */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Enlaces rápidos
              </Typography>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "1rem" }}>
                Home
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "1rem" }}>
                Propiedades
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "1rem" }}>
                Contacto
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "1rem" }}>
                Iniciar Sesión
              </Link>
            </Box>

            {/* Redes sociales */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Síguenos
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton
                  href="#"
                  sx={{
                    color: "#F9FAFB",
                    "&:hover": { color: "#3B82F6", transform: "scale(1.1)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: "#F9FAFB",
                    "&:hover": { color: "#E1306C", transform: "scale(1.1)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: "#F9FAFB",
                    "&:hover": { color: "#1DA1F2", transform: "scale(1.1)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: "#F9FAFB",
                    "&:hover": { color: "#0A66C2", transform: "scale(1.1)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Línea de copyright */}
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          fontSize: "0.875rem",
          color: "#9CA3AF",
        }}
      >
        © {new Date().getFullYear()} InmoPlataform. Todos los derechos reservados.
      </Box>
    </Box>
  );
}
