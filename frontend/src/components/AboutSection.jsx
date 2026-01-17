import { Box, Typography, Button, Grid } from "@mui/material";

export default function AboutSection() {
  return (
    <Box
      sx={{
        py: 12,
        px: 4,
        // backgroundColor eliminado para que el hero se vea detrás
        color: "#fff", // texto blanco para contraste
        position: "relative",
      }}
    >
      {/* Overlay semi-transparente opcional para mejorar lectura */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)", // negro semitransparente
          zIndex: 1,
          borderRadius: 0,
        }}
      />

      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative", zIndex: 2 }} // contenido sobre el overlay
      >
        {/* Lado izquierdo: solo espacio visual */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              height: 300,
              borderRadius: 2,
              backgroundColor: "rgba(227, 227, 227, 0.57)", // sutil para destacar
              mx: "auto",
            }}
          />
        </Grid>

        {/* Lado derecho: texto y beneficios */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 500, mx: "auto" }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#3B82F6",
                textTransform: "uppercase",
                fontWeight: "bold",
                mb: 1,
                fontSize: "1.2rem",
              }}
            >
              About Us
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Tu Hogar Ideal, Más Cerca Que Nunca
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              En <strong>InmoPlataform</strong> hacemos que encontrar tu hogar ideal sea fácil y seguro.  
              Descubre propiedades únicas, con fotos reales y asesoramiento experto,  
              para que comprar o alquilar sea una experiencia confiable y sin complicaciones.
            </Typography>

            {/* Lista con fuente moderna */}
            <Box sx={{ mb: 3 }}>
              <Typography
                component="ul"
                sx={{
                  paddingLeft: "1.2rem",
                  marginBottom: "1.5rem",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "#fff",
                }}
              >
                <li>Diseños modernos y funcionales</li>
                <li>Propiedades destacadas en tu zona</li>
                <li>Asesoramiento profesional</li>
                <li>Seguridad y confianza 24/7</li>
              </Typography>
            </Box>

            <Button variant="contained" color="primary">
              Conocer Más
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
