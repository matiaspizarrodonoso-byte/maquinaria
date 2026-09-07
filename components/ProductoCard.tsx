import Link from "next/link";
import type { Producto } from "@/lib/productos";
import {
  formatearPrecio,
  imagenPortada,
  referencia,
  urlWhatsApp,
} from "@/lib/productos";

const MAX_DESCRIPCION = 110;

function truncar(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return texto.slice(0, max).trimEnd() + "…";
}

/**
 * Tarjeta de producto del catálogo. Usa la estructura exacta del mockup
 * (.nameplate con .tag, .art, .body, .model, h3, .card-descripcion,
 * .spec-rows, .foot) para heredar el estilo de index.css.
 */
export default function ProductoCard({ producto }: { producto: Producto }) {
  const portada = imagenPortada(producto);

  // Solo se muestran las specs que tienen valor (un generador no tiene
  // "alcance", una grúa sí — roadmap).
  const specs: { k: string; v: string }[] = [];
  if (producto.anio != null) specs.push({ k: "Año", v: String(producto.anio) });
  if (producto.potencia) specs.push({ k: "Potencia", v: producto.potencia });
  if (producto.capacidad) specs.push({ k: "Capacidad", v: producto.capacidad });
  if (producto.alcance) specs.push({ k: "Alcance", v: producto.alcance });

  return (
    <article className="nameplate">
      {producto.categoria && <span className="tag">{producto.categoria}</span>}

      <Link href={`/catalogo/${producto.id}`} className="art" aria-label={`Ver ficha de ${producto.nombre}`}>
        {portada ? (
          // eslint-disable-next-line @next/next/no-img-element -- markup del mockup; next/image cambiaría la estructura y pediría remotePatterns.
          <img src={portada} alt={producto.nombre} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="8" width="13" height="8" rx="1" />
            <path d="M16 11h3l2 3v2h-5" />
            <circle cx="7" cy="18" r="1.6" />
            <circle cx="18" cy="18" r="1.6" />
          </svg>
        )}
      </Link>

      <div className="body">
        <div className="model">{referencia(producto)}</div>
        <h3>
          <Link href={`/catalogo/${producto.id}`}>{producto.nombre}</Link>
        </h3>

        {producto.descripcion && (
          <p className="card-descripcion">{truncar(producto.descripcion, MAX_DESCRIPCION)}</p>
        )}

        {specs.length > 0 && (
          <div className="spec-rows">
            {specs.map((s) => (
              <div className="spec" key={s.k}>
                <div className="k">{s.k}</div>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </div>
        )}

        <div className="foot">
          <div className="price">
            {formatearPrecio(producto.precio)}
            <span>{producto.precio != null ? "CLP" : "precio a convenir"}</span>
          </div>
          <a className="link-arrow" href={urlWhatsApp(producto)} target="_blank" rel="noopener">
            Consultar →
          </a>
        </div>
      </div>
    </article>
  );
}
