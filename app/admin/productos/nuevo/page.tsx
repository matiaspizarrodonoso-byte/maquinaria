import { requireAdmin } from "@/lib/admin-auth";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductoForm from "@/components/admin/ProductoForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  await requireAdmin();

  return (
    <>
      <AdminHeader />
      <div className="container">
        <h2 style={{ marginBottom: "20px" }}>Nuevo producto</h2>
        <ProductoForm modo="nuevo" />
      </div>
    </>
  );
}
