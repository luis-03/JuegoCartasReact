// src/components/BarajadoOverlay.jsx
import React from "react";
import { motion } from "framer-motion";
import reversoCarta from "../assets/cartas/2FondoDelante.avif";

const BarajadoOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
      }}
    >
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        style={{
          width: 80,
          height: 120,
          backgroundImage: `url(${reversoCarta})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 8,
          border: "2px solid #fff",
          boxShadow: "0 0 12px rgba(255, 255, 255, 0.5)",
          transformStyle: "preserve-3d"
        }}
      />
    </motion.div>
  );
};

export default BarajadoOverlay;
