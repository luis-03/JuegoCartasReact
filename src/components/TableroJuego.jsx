import React, { useState, useEffect, useRef } from "react";
import MontonCartas from "./MontonCartas";
import { ordenMontones } from "../hooks/useJuegoCartas";
import { motion, AnimatePresence } from "framer-motion";
import reversoCarta from "../assets/cartas/2FondoDelante.avif";
import "../styles/tablero.css";
import "../styles/botones.css";

function estaMontonOrdenado(cartas, numeroMonton) {
  return (
    cartas.length === 4 &&
    cartas.every(c => c.valor === numeroMonton && c.bocaArriba)
  );
}

const posiciones = [
  [0, 0], [0, 2], [0, 4], [0, 6],
  [2, 0], [2, 6],
  [3, 3],
  [4, 0], [4, 6],
  [6, 0], [6, 2], [6, 4], [6, 6]
];
const FILAS = 7;

function TableroJuego({
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
  reiniciar,
  modo = "interactivo"
}) {
  const [animandoBarajado, setAnimandoBarajado] = useState(false);

  const audioGanar = useRef(null);
  const audioPerder = useRef(null);

  useEffect(() => {
    if (estado === "GANADO") {
      audioGanar.current?.play();
    } else if (estado === "PERDIDO") {
      audioPerder.current?.play();
    }
  }, [estado]);

    
  if (!repartido) {
    return (
      <div style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        background: "#8a0c0cff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h2 style={{ color: "#fff" }}>Baraja lista para repartir</h2>

        <MontonCartas
          cartas={baraja.map(c => ({ ...c, bocaArriba: false }))}
          separacion={0.6}
        />

        <div style={{ display: "flex", gap: 150, marginTop: 100 }}>
          <button
            onClick={() => {
              setAnimandoBarajado(true);
              setTimeout(() => {
                barajar();
                setAnimandoBarajado(false);
              }, 1000);
            }}
            className="boton-principal"
          >
            Barajar
          </button>

          <button onClick={repartir} className="boton-principal">
            Iniciar juego
          </button>
        </div>

        {/* ANIMACIÓN DE CARTAS AL BARAJAR */}
        <AnimatePresence>
          {animandoBarajado && (
            <motion.div
              key="barajado"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.65)",
                zIndex: 999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "relative", width: 200, height: 200 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.img
                    key={i}
                    src={reversoCarta}
                    alt="Carta"
                    initial={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: 0
                    }}
                    animate={{
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 60 - 30,
                      rotate: Math.random() * 360 - 180,
                      opacity: 1
                    }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    style={{
                      width: 60,
                      height: 95,
                      borderRadius: 8,
                      border: "1.5px solid #fff",
                      boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render del tablero
  const tablero = Array(FILAS).fill(null).map(() => Array(FILAS).fill(null));
  posiciones.forEach(([fila, col], idx) => {
    const num = ordenMontones[idx];
    const cartas = montones[num - 1] || [];
    const activo = jugando && montonActual === num - 1 && estado === "EN_CURSO" && cartas.length;
    const ordenado = estaMontonOrdenado(cartas, num);
    tablero[fila][col] = (
      <MontonCartas
        key={idx}
        cartas={cartas}
        activo={activo}
        ordenado={ordenado}
        onMontonClick={activo ? jugarTurnoInteractivo : undefined}
        separacion={10}
      />
    );
  });
  const flatTablero = tablero.flat();

  const cellW = 90, cellH = 57, hGap = 1, vGap = 12;
  const gridW = 800, gridH = 560;

  return (
    <div style={{
  position: "relative",
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "5px",
  boxSizing: "border-box",
  overflow: "hidden" // Asegura que el video no desborde
}}>
  {/* Video de fondo */}
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
      opacity: 0.35 // Puedes ajustar la visibilidad
    }}
  >
    <source src="/videos/fondo-inicio2.mp4" type="video/mp4" />
    Tu navegador no soporta el video.
  </video>

  {/* Aquí sigue tu contenido dentro de este div */}

      {/* Mensajes */}
      <div style={{
        position: "absolute",
        top: "5px",
        right: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        color: "#fff",
        zIndex: 10
      }}>
        {jugadas === 52 ? (
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px" }}>
            ¡Ganaste! Todos los montones están ordenados.
          </div>
        ) : estado === "PERDIDO" ? (
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px" }}>
            Perdiste: los montones no quedaron ordenados.
          </div>
        ) : mensaje && (
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px" }}>
            {mensaje}
          </div>
        )}
        <div style={{ fontSize: "16px", marginBottom: "4px" }}>
          Jugadas: {jugadas}/52
        </div>
        {modo === "interactivo" && estado === "EN_CURSO" && (
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>
            Haz clic solo en el montón activo.
          </div>
        )}
        {estado !== "EN_CURSO" && (
          <button onClick={reiniciar} className="boton-principal">
            Volver a jugar
          </button>
        )}
      </div>

      {/* Tablero de juego */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(7, ${cellW}px)`,
        gridTemplateRows: `repeat(7, ${cellH}px)`,
        columnGap: `${hGap}px`,
        rowGap: `${vGap}px`,
        width: `${gridW}px`,
        height: `${gridH}px`,
        border: "12px solid #8c2f00ff",
        borderRadius: "150px",
        boxSizing: "content-box",
        paddingLeft: "110px",
        paddingTop: "15px",
        background: "#97020eff"
      }}>
        {flatTablero.map((monton, idx) => (
          <div key={idx} style={{
            width: `${cellW}px`,
            height: `${cellH}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {monton}
          </div>
        ))}
      </div>

      
      <audio ref={audioGanar} src="/audio/ganar.mp3" preload="auto" />
      <audio ref={audioPerder} src="/audio/perder.mp3" preload="auto" />
    </div>
  );
}

export default TableroJuego;
