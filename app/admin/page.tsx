import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { formatearPrecio, imagenPortada, referencia } from "@/lib/productos";
import AdminHeader from "@/components/admin/AdminHeader";
import EliminarProductoButton from "@/components/admin/EliminarProductoButton";

// El dashboard lee la DB en cada request (datos siempre frescos).
export const dynamic = "force-dynamic";

type Fila = {
  id: number;
  nombre: string;
  precio: number | null;
  categoria: string | null;
  activo: number;
  producto_imagenes: { url: string; orden: number }[];
};

export default async function AdminPage() {
  // Guard: sin sesión → /admin/login (requireAdmin redirige).
  const supabase = await requireAdmin();

  // A diferencia del catálogo público, acá se ven TODOS los productos
  // (activos e inactivos): la sesión authenticated lo permite por RLS.
  const { data: productos, error } = await supabase
    .from("productos")
    .select("id, nombre, precio, categoria, activo, producto_imagenes(url, orden)")
    .order("id", { ascending: false });

  const filas = (productos ?? []) as Fila[];

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <h2>Productos</h2>
          <Link href="/admin/productos/nuevo" className="btn btn-primary">
            + Nuevo producto
          </Link>
        </div>

        {error ? (
          <div className="error">No se pudo cargar la lista de productos.</div>
        ) : filas.length === 0 ? (
          <div className="empty">No hay productos todavía. Creá el primero.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>REF</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((p) => {
                  const portada = imagenPortada(p);
                  return (
                    <tr key={p.id}>
                      <td>
                        {portada ? (
                          // eslint-disable-next-line @next/next/no-img-element -- thumb de tabla; next/image no aplica acá.
                          <img className="table-img" src={portada} alt="" />
                        ) : (
                          <div className="table-img" />
                        )}
                      </td>
                      <td>{referencia(p)}</td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria ?? "—"}</td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>
                        <span
                          className={
                            p.activo === 1 ? "estado-badge" : "estado-badge inactivo"
                          }
                        >
                          {p.activo === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="row-actions">
                        <Link href={`/admin/productos/${p.id}/editar`}>Editar</Link>
                        <EliminarProductoButton id={p.id} nombre={p.nombre} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
