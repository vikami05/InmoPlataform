// src/components/MiniChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

export default function MiniChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 🔹 Scroll automático al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => setOpen(!open);

  const handleSend = async () => {
    if (!input.trim()) return; // No enviar mensajes vacíos

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const botMessage = { sender: "bot", text: data.reply || "Lo siento, no entendí tu consulta." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetch chat:", error);
      const errorMessage = { sender: "bot", text: "❌ Error al contactar al servidor." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 1000,
      }}
    >
      {/* 🔹 Botón para abrir/cerrar chat */}
      <IconButton
        onClick={toggleChat}
        sx={{
          backgroundColor: "#1E40AF",
          color: "#fff",
          "&:hover": { backgroundColor: "#1c3aa8" },
          width: 60,
          height: 60,
        }}
      >
        <ChatBubbleIcon fontSize="large" />
      </IconButton>

      {open && (
        <Paper
          elevation={8}
          sx={{
            mt: 2,
            width: 320,
            maxHeight: 450,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Mensajes */}
          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#1E40AF" : "#E5E7EB",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              display: "flex",
              borderTop: "1px solid #ddd",
              p: 1,
              backgroundColor: "#f9f9f9",
            }}
          >
            <TextField
              variant="standard"
              placeholder="Escribí tu mensaje..."
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{ disableUnderline: true }}
            />
            <IconButton onClick={handleSend} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
