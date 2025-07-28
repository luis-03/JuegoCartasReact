import useMusicaFondo from "../hooks/useMusicaFondo";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const InicioPage = () => {
  useMusicaFondo("/audio/068. Death By Glamour (UNDERTALE Soundtrack) - Toby Fox.mp3");

  const navigate = useNavigate();
  const [modo, setModo] = useState("interactivo");

  const handleIniciar = () => {
    navigate(`/juego-${modo}`);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 🎥 Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          minWidth: "100%",
          minHeight: "100%",
          objectFit: "cover",
          zIndex: -1
        }}
      >
        <source src="/videos/fondo-inicio.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      {/* Contenido sobre el video */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#fff", fontSize: "2.5rem", marginBottom: 20 }}
        >
          Juego de Cartas
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "#2b2f3a",
            borderRadius: 16,
            padding: 40,
            boxShadow: "0 4px 32px #0003",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <h2 style={{ color: "#fff", marginBottom: 24 }}>
            Selecciona el modo de juego
          </h2>

          <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
            {["automatico", "interactivo"].map((tipo) => (
              <motion.button
                key={tipo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModo(tipo)}
                style={{
                  padding: "16px 32px",
                  borderRadius: 8,
                  border: modo === tipo ? "2px solid #15e76b" : "2px solid #ccc",
                  background: modo === tipo ? "#19a94a" : "#fff",
                  color: modo === tipo ? "#fff" : "#222",
                  fontSize: 20,
                  cursor: "pointer",
                  fontWeight: modo === tipo ? "bold" : "normal"
                }}
              >
                {tipo === "automatico" ? "Automático" : "Interactivo"}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleIniciar}
            className="boton-principal"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Iniciar juego
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InicioPage;
