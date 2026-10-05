import Link from "next/link";
import type { Producto } from "@/lib/productos";
import {
  imagenPortada,
  referencia,
  specsDeProducto,
  urlWhatsApp,
} from "@/lib/productos";
import PlaceholderMaquinaria from "@/components/PlaceholderMaquinaria";
import PrecioProducto from "@/components/PrecioProducto";

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
  const specs = specsDeProducto(producto);

  return (
    <article className="nameplate">
      {producto.categoria && <span className="tag">{producto.categoria}</span>}

      <Link href={`/catalogo/${producto.id}`} className="art" aria-label={`Ver ficha de ${producto.nombre}`}>
        {portada ? (
          // eslint-disable-next-line @next/next/no-img-element -- markup del mockup; next/image cambiaría la estructura y pediría remotePatterns.
          <img src={portada} alt={producto.nombre} />
        ) : (
          <PlaceholderMaquinaria />
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
          <PrecioProducto precio={producto.precio} />
          <a className="link-arrow" href={urlWhatsApp(producto)} target="_blank" rel="noopener">
            Consultar →
          </a>
        </div>
      </div>
    </article>
  );
}
