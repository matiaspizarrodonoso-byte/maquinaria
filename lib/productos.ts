import { supabase } from "@/lib/supabase";

/**
 * Capa de datos del catálogo público. Separada de los componentes para
 * reutilizarla en la ficha individual (/catalogo/[id]) y en el admin.
 */

export type ProductoImagen = {
  url: string;
  orden: number;
};

export type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: string | null;
  anio: number | null;
  potencia: string | null;
  capacidad: string | null;
  alcance: string | null;
  producto_imagenes: ProductoImagen[];
};

/**
 * Productos activos (activo = 1) con sus imágenes embebidas.
 * Usa el cliente anon: lectura pública permitida por RLS, sin sesión.
 */
export async function getProductosActivos(): Promise<{
  productos: Producto[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, descripcion, precio, categoria, anio, potencia, capacidad, alcance, producto_imagenes(url, orden)"
    )
    .eq("activo", 1)
    .order("id", { ascending: false });

  if (error) {
    return { productos: [], error: error.message };
  }
  return { productos: (data ?? []) as Producto[], error: null };
}

/**
 * Un producto por id, solo si está activo (la ficha pública muestra 404 para
 * inexistentes o inactivos). Imágenes incluidas, ordenadas por `orden`.
 */
export async function getProductoPorId(id: number): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, descripcion, precio, categoria, anio, potencia, capacidad, alcance, producto_imagenes(url, orden)"
    )
    .eq("id", id)
    .eq("activo", 1)
    .maybeSingle();

  if (error || !data) return null;
  return data as Producto;
}

/** Imagen de portada (orden = 0); si no existe, la primera; null si no hay fotos. */
export function imagenPortada(p: Producto): string | null {
  const portada =
    p.producto_imagenes.find((img) => img.orden === 0) ?? p.producto_imagenes[0];
  return portada?.url ?? null;
}

/** "$ 62.000.000" en locale es-CL; "Consultar" si el precio no está cargado. */
export function formatearPrecio(precio: number | null): string {
  if (precio == null) return "Consultar";
  return "$ " + new Intl.NumberFormat("es-CL").format(precio);
}

/** Referencia técnica de la tarjeta: REF-0007 a partir del id numérico. */
export function referencia(p: Producto): string {
  return `REF-${String(p.id).padStart(4, "0")}`;
}

/** Link wa.me con mensaje pre-armado incluyendo nombre y referencia del equipo. */
export function urlWhatsApp(p: Producto): string {
  const mensaje = `Hola, vi el ${p.nombre} (${referencia(p)}) en el catálogo de Forja y me interesa. ¿Sigue disponible?`;
  return `https://wa.me/56933266433?text=${encodeURIComponent(mensaje)}`;
}
