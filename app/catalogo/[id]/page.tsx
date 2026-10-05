import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GaleriaProducto from "@/components/GaleriaProducto";
import PrecioProducto from "@/components/PrecioProducto";
import {
  getProductoPorId,
  parsearIdProducto,
  referencia,
  specsDeProducto,
  urlWhatsApp,
} from "@/lib/productos";

// La ficha lee Supabase en cada request, sin caché de Next.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const n = parsearIdProducto(id);
  const producto = n ? await getProductoPorId(n) : null;
  if (!producto) return { title: "Producto no encontrado — maq-usos" };
  return {
    title: `${producto.nombre} — maq-usos`,
    description: producto.descripcion ?? undefined,
  };
}

export default async function FichaProducto({ params }: Props) {
  const { id } = await params;
  const n = parsearIdProducto(id);
  if (!n) notFound();

  const producto = await getProductoPorId(n);
  if (!producto) notFound();

  const specs = specsDeProducto(producto);

  return (
    <>
      <Header />
      <main className="ficha wrap">
        <Link href="/#catalogo" className="ficha-back">
          ← Volver al catálogo
        </Link>

        <div className="ficha-panel">
          <GaleriaProducto imagenes={producto.producto_imagenes} nombre={producto.nombre} />

          <div className="ficha-info">
            {producto.categoria && <span className="ficha-cat">{producto.categoria}</span>}
            <div className="model">{referencia(producto)}</div>
            <h1>{producto.nombre}</h1>

            <div className="ficha-precio">
              <PrecioProducto precio={producto.precio} />
            </div>

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

            {producto.descripcion && (
              <p className="ficha-descripcion">{producto.descripcion}</p>
            )}

            <a
              className="btn btn-amber btn-wa"
              href={urlWhatsApp(producto)}
              target="_blank"
              rel="noopener"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
