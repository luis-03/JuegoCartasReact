import React from "react";
import { motion } from "framer-motion";
import reversoCarta from "../assets/cartas/2FondoDelante.avif";

function getCardImageFileName(valor, palo) {
  let valorStr;
  if (valor === 1) valorStr = "ace";
  else if (valor === 11) valorStr = "jack";
  else if (valor === 12) valorStr = "queen";
  else if (valor === 13) valorStr = "king";
  else valorStr = valor.toString();

  let paloStr;
  if (palo === "hearts") paloStr = "hearts";
  else if (palo === "diamonds") paloStr = "diamonds";
  else if (palo === "clubs") paloStr = "clubs";
  else if (palo === "spades") paloStr = "spades";

  return `${valorStr}_of_${paloStr}.png`;
}

const Carta = ({ valor, palo, mostrarFrente }) => {
  const filename = getCardImageFileName(valor, palo);
  const src = require(`../assets/cartas/${filename}`);

  return (
    <div
      style={{
        width: "60px",
        height: "95px",
        perspective: 800
      }}
    >
      <motion.div
        animate={{ rotateY: mostrarFrente ? 0 : 180 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Cara frontal */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden"
          }}
        >
          <img
            src={src}
            alt={`${valor} de ${palo}`}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              border: "1.5px solid #aaa",
              boxShadow: "0 1px 4px #0002",
              background: "white"
            }}
            draggable={false}
          />
        </div>

        {/* Cara trasera */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden"
          }}
        >
          <img
            src={reversoCarta}
            alt="reverso"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              border: "1.5px solid #aaa",
              boxShadow: "0 1px 4px #0002",
              background: "white"
            }}
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Carta;
