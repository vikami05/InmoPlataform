import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Button, Avatar } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ bgColor = "transparent" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const textColor = location.pathname === "/" ? "white" : "black";
  const hoverBg = location.pathname === "/" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

  // 🔁 Verificar sesión actual
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/me/", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [location.pathname]);

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Error logout:", err);
    }
  };

  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: bgColor,
        boxShadow: "none",
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 🏠 Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ fontWeight: "bold", color: textColor, textDecoration: "none" }}
        >
          InmoPlatform
        </Typography>

        {/* 🔗 Links de navegación */}
        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
          {["Home", "Propiedades"].map((text, i) => {
            const paths = ["/", "/properties"];
            return (
              <Typography
                key={i}
                component={Link}
                to={paths[i]}
                sx={{
                  color: textColor,
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: "#1E40AF" },
                }}
              >
                {text}
              </Typography>
            );
          })}

          {/* 👤 Usuario / Login */}
          {location.pathname === "/" ? (
            // 🟢 En Home: mostrar siempre el muñequito (link a perfil o login)
            <IconButton
              component={Link}
              to={user ? "/profile" : "/login"}
              sx={{
                color: textColor,
                bgcolor: "transparent",
                "&:hover": { bgcolor: hoverBg },
                borderRadius: "50%",
              }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          ) : user ? (
            // 🟢 En otras páginas: mostrar usuario y cerrar sesión
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {user.profile?.photo ? (
                <Avatar src={user.profile.photo} alt={user.name} />
              ) : (
                <AccountCircle fontSize="large" sx={{ color: textColor }} />
              )}
              <Typography sx={{ color: textColor }}>
                {user.name || user.nombre || user.username || user.email}
              </Typography>
              <Button
                onClick={handleLogout}
                sx={{
                  color: textColor,
                  textTransform: "none",
                  "&:hover": { bgcolor: hoverBg },
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          ) : (
            // 🔵 Usuario no logueado: muñequito que lleva a login
            <IconButton
              component={Link}
              to="/login"
              sx={{
                color: textColor,
                bgcolor: "transparent",
                "&:hover": { bgcolor: hoverBg },
                borderRadius: "50%",
              }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
