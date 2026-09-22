import Link from "next/link";
import { getCategorias, getProductosActivos } from "@/lib/productos";
import ProductoCard from "@/components/ProductoCard";

/**
 * Catálogo público: trae los productos activos de Supabase en el servidor,
 * con filtro por categoría vía URL (/?cat=Grúas#catalogo). Los chips del
 * filtro se arman con las categorías existentes en productos activos.
 * Estados: error de query / sin productos / grilla de tarjetas .nameplate.
 */
export default async function Catalogo({
  categoriaActiva,
}: {
  categoriaActiva?: string;
}) {
  const [{ productos, error }, categorias] = await Promise.all([
    getProductosActivos(categoriaActiva),
    getCategorias(),
  ]);

  return (
    <main className="listings wrap" id="catalogo">
      <div className="section-head">
        <div>
          <h2>Catálogo de equipos</h2>
          <p>Inventario actualizado, con inspección técnica y horas verificadas en cada unidad.</p>
        </div>

        {categorias.length > 0 && (
          <div className="filtro">
            <Link
              href="/#catalogo"
              className={!categoriaActiva ? "filtro-btn activa" : "filtro-btn"}
            >
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={`/?cat=${encodeURIComponent(cat)}#catalogo`}
                className={categoriaActiva === cat ? "filtro-btn activa" : "filtro-btn"}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <div className="error">No se pudo cargar el catálogo. Intenta nuevamente en unos minutos.</div>
      ) : productos.length === 0 ? (
        <div className="empty">
          {categoriaActiva
            ? "No hay productos en esta categoría."
            : "No hay productos disponibles."}
        </div>
      ) : (
        <div id="productos-grid" className="grid">
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </main>
  );
}
