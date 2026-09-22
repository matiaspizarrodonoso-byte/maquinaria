import { requireAdmin } from "@/lib/admin-auth";
import { CATEGORIAS_BASE } from "@/lib/productos";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductoForm from "@/components/admin/ProductoForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const supabase = await requireAdmin();

  // Lista del select: las 5 fijas del negocio + las que ya existan en la DB.
  const { data } = await supabase
    .from("productos")
    .select("categoria")
    .not("categoria", "is", null);
  const categorias = [
    ...new Set([...CATEGORIAS_BASE, ...(data ?? []).map((d) => d.categoria as string)]),
  ].sort((a, b) => a.localeCompare(b, "es"));

  return (
    <>
      <AdminHeader />
      <div className="container">
        <h2 style={{ marginBottom: "20px" }}>Nuevo producto</h2>
        <ProductoForm modo="nuevo" categorias={categorias} />
      </div>
    </>
  );
}
