"use client";

import { useState } from "react";
import type { ProductoImagen } from "@/lib/productos";
import PlaceholderMaquinaria from "@/components/PlaceholderMaquinaria";

/**
 * Galería de la ficha: imagen principal + miniaturas clickeables que la
 * reemplazan (máx. 3 por la regla de negocio). Solo se muestran las imágenes
 * que existen, sin huecos; si hay una sola, no hay miniaturas; si no hay
 * ninguna, placeholder SVG estilo blueprint.
 */
export default function GaleriaProducto({
  imagenes,
  nombre,
}: {
  imagenes: ProductoImagen[];
  nombre: string;
}) {
  const ordenadas = [...imagenes].sort((a, b) => a.orden - b.orden);
  const [activa, setActiva] = useState(0);

  if (ordenadas.length === 0) {
    return (
      <div className="ficha-galeria">
        <div className="galeria-main">
          <PlaceholderMaquinaria />
        </div>
      </div>
    );
  }

  const actual = ordenadas[Math.min(activa, ordenadas.length - 1)];

  return (
    <div className="ficha-galeria">
      <div className="galeria-main">
        {/* eslint-disable-next-line @next/next/no-img-element -- markup del mockup; next/image pediría remotePatterns y cambiaría la estructura. */}
        <img src={actual.url} alt={nombre} />
      </div>

      {ordenadas.length > 1 && (
        <div className="galeria-thumbs">
          {ordenadas.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              className={i === activa ? "thumb activa" : "thumb"}
              onClick={() => setActiva(i)}
              aria-label={`Ver imagen ${i + 1} de ${nombre}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
