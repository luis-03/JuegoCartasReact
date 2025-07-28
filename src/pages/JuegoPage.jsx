// src/pages/JuegoPage.jsx
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TableroJuego from "../components/TableroJuego";
import useJuegoCartas from "../hooks/useJuegoCartas";
import "../styles/botones.css";
import "../styles/tablero.css";
import useMusicaFondo from "../hooks/useMusicaFondo";

const JuegoPage = () => {
  const location = useLocation();
  const modo = location.pathname.includes("automatico") ? "automatico" : "interactivo";
  const navigate = useNavigate();

  const {
    baraja,
    repartido,
    montones,
    montonActual,
    jugando,
    mensaje,
    estado,
    jugadas,
    barajar,
    repartir,
    jugarTurnoInteractivo,
    reiniciar
  } = useJuegoCartas(modo);

  useMusicaFondo(
    modo === "automatico"
      ? "/audio/modo-automatico.mp3"
      : "/audio/modo-interactivo.mp3"
  );

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* VIDEO DE FONDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
          opacity: 0.45  // Puedes ajustar la visibilidad del video
        }}
      >
        <source src="/videos/fondo-inicio2.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      {/* CONTENIDO */}
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
          justifyContent: "flex-start",
          paddingTop: "20px"
        }}
      >
        <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
          <button
            onClick={() => navigate("/")}
            className="boton-principal"
            style={{
              position: "absolute",
              left: 20,
              top: 0,
              fontSize: "1rem",
              padding: "6px 16px"
            }}
          >
            ← Volver
          </button>
          <h1 style={{
            color: "#fff",
            fontSize: "1.2rem",
            margin: 0,
            padding: "8px 0"
          }}>
            {modo === "automatico" ? "Modo Automático" : "Modo Interactivo"}
          </h1>
        </div>

        <TableroJuego
          baraja={baraja}
          repartido={repartido}
          montones={montones}
          montonActual={montonActual}
          jugando={jugando}
          mensaje={mensaje}
          estado={estado}
          jugadas={jugadas}
          barajar={barajar}
          repartir={repartir}
          jugarTurnoInteractivo={jugarTurnoInteractivo}
          reiniciar={reiniciar}
          modo={modo}
        />
      </motion.div>
    </div>
  );
};

export default JuegoPage;
