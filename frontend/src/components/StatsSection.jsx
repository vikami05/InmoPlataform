import { Box, Grid, Typography } from "@mui/material";

export default function StatsSection() {
  const stats = [
    { number: "560+", label: "Total Area Sq" },
    { number: "197K+", label: "Apartments Sold" },
    { number: "268+", label: "Total Constructions" },
    { number: "340+", label: "Apart Rooms" },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
      <Grid container spacing={4} justifyContent="center" textAlign="center">
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Typography variant="h4" color="primary">{stat.number}</Typography>
            <Typography variant="subtitle1">{stat.label}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
