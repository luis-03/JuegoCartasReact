import { useState } from "react";

export const ordenMontones = [2, 3, 4, 5, 13, 6, 1, 12, 7, 11, 10, 9, 8];
const valores = [1,2,3,4,5,6,7,8,9,10,11,12,13];
const palos = ["hearts", "spades", "clubs", "diamonds"];

function generarBaraja() {
  let mazo = [];
  for (let palo of palos)
    for (let valor of valores)
      mazo.push({ valor, palo });
  return mazo;
}

function riffleShuffle(mazo) {
  // Calcula el punto medio del mazo.
  const mitad = Math.floor(mazo.length / 2);

  // Se elige un número entre 2 y 5 para cortar el mazo
  const offset = Math.floor(Math.random() * 4) + 2;

  // El corte se desplaza aleatoriamente hacia la izquierda o la derecha del centro.
  const cut = mitad + (Math.random() < 0.5 ? -offset : offset);

  // Se divide el mazo en dos mitades: izquierda y derecha.
  let left = mazo.slice(0, cut);
  let right = mazo.slice(cut);

  // Se crea un nuevo arreglo donde se irá armando el mazo barajado.
  let resultado = [];

  // Mientras alguna mitad tenga cartas, se sigue mezclando.
  while (left.length > 0 || right.length > 0) {
    // Se toman entre 1 y 3 cartas de la mitad izquierda.
    const l = Math.min(left.length, 1 + Math.floor(Math.random() * 3));
    const cartasL = left.splice(0, l);

    // Cada carta se inserta en una posición aleatoria dentro del nuevo mazo.
    cartasL.forEach(carta => {
      const index = Math.floor(Math.random() * (resultado.length + 1));
      resultado.splice(index, 0, carta);
    });

    // Se toman entre 1 y 3 cartas de la mitad derecha.
    const r = Math.min(right.length, 1 + Math.floor(Math.random() * 3));
    const cartasR = right.splice(0, r);

    // Se insertan también en posiciones aleatorias del nuevo mazo.
    cartasR.forEach(carta => {
      const index = Math.floor(Math.random() * (resultado.length + 1));
      resultado.splice(index, 0, carta);
    });
  }

  // Devuelve el mazo completamente mezclado.
  return resultado;
}


function repartirMontonesEspiral(baraja) {
  const montones = Array(13).fill(null).map(() => []);
  let idxBaraja = 0;
  for (let ronda = 0; ronda < 4; ronda++) {
    for (let j = 0; j < 13; j++) {
      const idxMonton = ordenMontones[j] - 1;
      montones[idxMonton].push({ ...baraja[idxBaraja++], bocaArriba: false });
    }
  }
  return montones;
}

function estaMontonOrdenado(cartas, numeroMonton) {
  if (cartas.length !== 4) return false;
  return cartas.every(c => c.valor === numeroMonton && c.bocaArriba);
}

function montonesCompletosOrdenados(montones) {
  for (let i = 0; i < 13; i++) {
    if (!estaMontonOrdenado(montones[i], i + 1)) return false;
  }
  return true;
}

export default function useJuegoCartas(modo = "interactivo") {
  const [baraja, setBaraja] = useState(riffleShuffle(generarBaraja()));
  const [repartido, setRepartido] = useState(false);
  const [montones, setMontones] = useState(Array(13).fill(null).map(() => []));
  const [montonActual, setMontonActual] = useState(0);
  const [jugadas, setJugadas] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("EN_CURSO");

  function reiniciar() {
    setBaraja(riffleShuffle(generarBaraja()));
    setMontones(Array(13).fill(null).map(() => []));
    setRepartido(false);
    setMontonActual(0);
    setJugadas(0);
    setJugando(false);
    setMensaje("");
    setEstado("EN_CURSO");
  }

  function barajarMazo() {
    if (repartido) return;
    setBaraja(riffleShuffle(generarBaraja()));
    setMontones(Array(13).fill(null).map(() => []));
    setJugadas(0);
    setMensaje("");
    setJugando(false);
    setMontonActual(0);
    setEstado("EN_CURSO");
  }

  function repartir() {
    if (repartido) return;
    const nuevosMontones = repartirMontonesEspiral(baraja);
    setMontones(nuevosMontones);
    setRepartido(true);
    setJugando(modo === "interactivo");
    setMontonActual(0);
    setJugadas(0);
    setMensaje("");
    setEstado("EN_CURSO");

    if (modo === "automatico") {
      setTimeout(() => {
        jugarAutomatico(nuevosMontones);
      }, 350);
    }
  }

  function getMontonDestino(valor) {
    return valor % 13;
  }

  function jugarTurnoInteractivo() {
    if (!jugando || estado !== "EN_CURSO") return;
    const idx = montonActual;
    if (montones[idx].length === 0) {
      setJugando(false);
      setEstado("PERDIDO");
      setMensaje("Perdiste: montón vacío.");
      return;
    }
    // Chequear si la carta de abajo ya fue levantada
    if (montones[idx][0].bocaArriba) {
      setJugando(false);
      setEstado("PERDIDO");
      setMensaje("Perdiste: intentaste levantar una carta ya jugada.");
      return;
    }
    const nuevosMontones = montones.map(m => [...m]);
    const carta = { ...nuevosMontones[idx][0], bocaArriba: true };
    nuevosMontones[idx].shift();
    const destino = getMontonDestino(carta.valor);
    nuevosMontones[destino].push(carta);

    const nuevasJugadas = jugadas + 1;
    setMontones(nuevosMontones);
    setJugadas(nuevasJugadas);
    setMontonActual(destino);
    setMensaje("");

    if (nuevasJugadas === 52) {
      setJugando(false);
      if (montonesCompletosOrdenados(nuevosMontones)) {
        setEstado("GANADO");
        setMensaje("¡Ganaste! Todos los montones están ordenados.");
      } else {
        setEstado("PERDIDO");
        setMensaje("Perdiste: los montones no quedaron ordenados.");
      }
    }
  }

  function jugarAutomatico(montonesIniciales) {
    let montonesAuto = montonesIniciales.map(m => [...m]);
    let actual = 0;
    let jugadasAuto = 0;
    let resultado = "EN_CURSO";
    let mensajeFinal = "";

    while (jugadasAuto < 52) {
      if (montonesAuto[actual].length === 0) {
        resultado = "PERDIDO";
        mensajeFinal = ` Perdiste: montón vacío en jugada ${jugadasAuto + 1}.`;
        break;
      }
      if (montonesAuto[actual][0].bocaArriba) {
        resultado = "PERDIDO";
        mensajeFinal = `Perdiste: intentaste levantar una carta ya jugada en jugada ${jugadasAuto + 1}.`;
        break;
      }
      const carta = { ...montonesAuto[actual][0], bocaArriba: true };
      montonesAuto[actual].shift();
      const destino = getMontonDestino(carta.valor);
      montonesAuto[destino].push(carta);
      jugadasAuto++;
      if (jugadasAuto === 52) {
        if (montonesCompletosOrdenados(montonesAuto)) {
          resultado = "GANADO";
          mensajeFinal = " ¡Ganaste! Todos los montones están ordenados.";
        } else {
          resultado = "PERDIDO";
          mensajeFinal = " Perdiste: los montones no quedaron ordenados.";
        }
        break;
      }
      actual = destino;
    }
    setMontones(montonesAuto);
    setJugadas(jugadasAuto);
    setJugando(false);
    setEstado(resultado);
    setMensaje(mensajeFinal);
  }

  return {
    baraja,
    repartido,
    montones,
    montonActual,
    jugando,
    mensaje,
    estado,
    jugadas,
    barajar: barajarMazo,
    repartir,
    jugarTurnoInteractivo,
    reiniciar
  };
}