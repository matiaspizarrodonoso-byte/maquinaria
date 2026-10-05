import { requireAdmin } from "@/lib/admin-auth";
import { getCategoriasAdmin } from "@/lib/productos";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductoForm from "@/components/admin/ProductoForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const supabase = await requireAdmin();
  const categorias = await getCategoriasAdmin(supabase);

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
