import { getProductosActivos } from "@/lib/productos";
import ProductoCard from "@/components/ProductoCard";

/**
 * Catálogo público: trae los productos activos de Supabase en el servidor.
 * Estados: error de query / sin productos / grilla de tarjetas .nameplate.
 * (No hay estado "loading": al ser SSR la página espera la query; loading
 * solo tendría sentido con fetch client-side.)
 */
export default async function Catalogo() {
  const { productos, error } = await getProductosActivos();

  return (
    <main className="listings wrap" id="catalogo">
      <div className="section-head">
        <div>
          <h2>Catálogo de equipos</h2>
          <p>Inventario actualizado, con inspección técnica y horas verificadas en cada unidad.</p>
        </div>
      </div>

      {error ? (
        <div className="error">No se pudo cargar el catálogo. Intenta nuevamente en unos minutos.</div>
      ) : productos.length === 0 ? (
        <div className="empty">No hay productos disponibles.</div>
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
