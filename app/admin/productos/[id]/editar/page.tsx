import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductoForm, {
  type ImagenExistente,
  type ProductoFormInicial,
} from "@/components/admin/ProductoForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

type FilaCompleta = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: string | null;
  anio: number | null;
  potencia: string | null;
  capacidad: string | null;
  alcance: string | null;
  activo: number;
  producto_imagenes: ImagenExistente[];
};

export default async function EditarProductoPage({ params }: Props) {
  const supabase = await requireAdmin();

  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) notFound();

  // Con sesión de admin: se puede editar cualquier producto, activo o no.
  const { data, error } = await supabase
    .from("productos")
    .select("*, producto_imagenes(id, url, orden)")
    .eq("id", n)
    .maybeSingle();

  if (error || !data) notFound();

  const p = data as FilaCompleta;

  const inicial: ProductoFormInicial = {
    nombre: p.nombre,
    descripcion: p.descripcion ?? "",
    precio: p.precio == null ? "" : String(p.precio),
    categoria: p.categoria ?? "",
    anio: p.anio == null ? "" : String(p.anio),
    potencia: p.potencia ?? "",
    capacidad: p.capacidad ?? "",
    alcance: p.alcance ?? "",
    activo: p.activo === 1,
  };

  return (
    <>
      <AdminHeader />
      <div className="container">
        <h2 style={{ marginBottom: "20px" }}>Editar producto — REF-{String(p.id).padStart(4, "0")}</h2>
        <ProductoForm
          modo="editar"
          productoId={p.id}
          inicial={inicial}
          imagenesIniciales={p.producto_imagenes}
        />
      </div>
    </>
  );
}
