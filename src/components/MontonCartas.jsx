import React from "react";
import { motion } from "framer-motion";
import Carta from "./Carta";

const MontonCartas = ({
  cartas,
  activo = false,
  ordenado = false,
  onMontonClick,
  separacion = 10 // Default: 10px para "escalera"
}) => {
  const puedeClic = activo && cartas.length > 0 && onMontonClick;

  return (
    <motion.div
      animate={{
        boxShadow: ordenado
          ? "0 0 20px 6px #225fff"
          : activo
          ? ["0 0 4px 2px gold", "0 0 16px 6px gold", "0 0 4px 2px gold"]
          : "0 0 0px 0px transparent",
        border: ordenado
          ? "4px solid #225fff"
          : activo
          ? "3px solid gold"
          : "1.5px solid #aaa"
      }}
      transition={{
        duration: activo || ordenado ? 1.5 : 0.3,
        repeat: activo ? Infinity : 0,
        repeatType: "loop"
      }}
      style={{
        position: "relative",
        width: "62px",
        height: `${30 + (cartas.length - 1) * separacion}px`,
        cursor: puedeClic ? "pointer" : "default",
        borderRadius: "8px",
        transition: "box-shadow 0.2s, border 0.2s"
      }}
      onClick={puedeClic ? onMontonClick : undefined}
      tabIndex={puedeClic ? 0 : -1}
      aria-label={puedeClic ? "Montón activo. Da click aquí." : undefined}
    >
      {cartas.map((carta, i) => (
        <motion.div
          key={i}
          layout
          initial={{ opacity: 0, y: -40, scale: 0.7 }}
          animate={{ opacity: 1, y: i * separacion, scale: 1 }}
          transition={{
            delay: i * 0.04,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          style={{
            position: "absolute",
            left: 0,
            zIndex: i + 1
          }}
        >
          <Carta
            valor={carta.valor}
            palo={carta.palo}
            mostrarFrente={!!carta.bocaArriba}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MontonCartas;
