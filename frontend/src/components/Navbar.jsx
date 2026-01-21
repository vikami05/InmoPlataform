import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ bgColor = "transparent" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const textColor = location.pathname === "/" ? "white" : "black";
  const hoverBg =
    location.pathname === "/"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)";

  // 🔁 Cargar usuario al montar y escuchar cambios del token
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }

      axios
        .get("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    };

    // Escucha evento de cambios en el token (login/logout)
    window.addEventListener("tokenChanged", loadUser);
    loadUser(); // ejecuta al montar

    return () => window.removeEventListener("tokenChanged", loadUser);
  }, []);

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("tokenChanged")); // 🔔 notifica al Navbar
    setUser(null);
    navigate("/login");
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
          sx={{
            fontWeight: "bold",
            color: textColor,
            textDecoration: "none",
          }}
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
          {user ? (
            // 🟢 Usuario logueado: Avatar + nombre clickeables + botón Logout
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                }}
                onClick={() => navigate("/profile")} // 👈 lleva al perfil
              >
                {user.profile?.photo ? (
                  <Avatar src={user.profile.photo} alt={user.name} />
                ) : (
                  <AccountCircle
                    fontSize="large"
                    sx={{ color: textColor }}
                  />
                )}
                <Typography sx={{ color: textColor, ml: 1 }}>
                  {user.name || user.username || user.email}
                </Typography>
              </Box>

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
            // 🔵 Usuario no logueado
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
