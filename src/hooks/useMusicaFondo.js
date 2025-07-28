// src/hooks/useMusicaFondo.js
import { useEffect, useRef } from "react";

export default function useMusicaFondo(ruta, volumen = 0.5, loop = true) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!ruta) return;

    // Si ya existe un audio, lo pausa y limpia
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(ruta);
    audio.volume = volumen;
    audio.loop = loop;
    audio.play().catch((e) => console.warn("Audio play failed", e));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [ruta, volumen, loop]);

  return audioRef;
}
