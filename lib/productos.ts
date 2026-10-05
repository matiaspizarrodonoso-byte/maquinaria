import type { SupabaseClient } from "@supabase/supabase-js";
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

/** Columnas que lee el catálogo público (producto + imágenes embebidas). */
const COLUMNAS_PRODUCTO =
  "id, nombre, descripcion, precio, categoria, anio, potencia, capacidad, alcance, producto_imagenes(url, orden)";

/**
 * Productos activos (activo = 1) con sus imágenes embebidas.
 * Usa el cliente anon: lectura pública permitida por RLS, sin sesión.
 * Si se pasa `categoria`, filtra por esa categoría exacta.
 */
export async function getProductosActivos(categoria?: string): Promise<{
  productos: Producto[];
  error: string | null;
}> {
  let query = supabase
    .from("productos")
    .select(COLUMNAS_PRODUCTO)
    .eq("activo", 1)
    .order("id", { ascending: false });

  if (categoria) query = query.eq("categoria", categoria);

  const { data, error } = await query;

  if (error) {
    return { productos: [], error: error.message };
  }
  return { productos: (data ?? []) as Producto[], error: null };
}

/**
 * Categorías distintas presentes en productos activos (el filtro del catálogo
 * se arma con los valores existentes, no con una lista fija — roadmap).
 */
export async function getCategorias(): Promise<string[]> {
  const { data } = await supabase
    .from("productos")
    .select("categoria")
    .eq("activo", 1)
    .not("categoria", "is", null);

  const unicas = new Set((data ?? []).map((d) => d.categoria as string));
  return [...unicas].sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Un producto por id, solo si está activo (la ficha pública muestra 404 para
 * inexistentes o inactivos). Imágenes incluidas, ordenadas por `orden`.
 */
export async function getProductoPorId(id: number): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select(COLUMNAS_PRODUCTO)
    .eq("id", id)
    .eq("activo", 1)
    .maybeSingle();

  if (error || !data) return null;
  return data as Producto;
}

/** Categorías fijas del negocio (las del mockup de la landing). El select del
 * admin las ofrece junto a las que ya existan en la DB. */
export const CATEGORIAS_BASE = [
  "Cargadores",
  "Grúas",
  "Tractores",
  "Compactadoras",
  "Generadores",
];

/**
 * Lista para el select del formulario admin: las fijas del negocio + las que
 * ya existan en la DB (de cualquier producto, activo o no). Requiere el
 * cliente autenticado (la RLS de admin ve todos los productos).
 */
export async function getCategoriasAdmin(
  supabaseAdmin: SupabaseClient
): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("productos")
    .select("categoria")
    .not("categoria", "is", null);

  const unicas = new Set([
    ...CATEGORIAS_BASE,
    ...(data ?? []).map((d) => d.categoria as string),
  ]);
  return [...unicas].sort((a, b) => a.localeCompare(b, "es"));
}

/** El id de la ruta es numérico (ej. /catalogo/12), no slug. null si no aplica. */
export function parsearIdProducto(id: string): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Imagen de portada (orden = 0); si no existe, la primera; null si no hay fotos. */
export function imagenPortada(p: {
  producto_imagenes: ProductoImagen[];
}): string | null {
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
export function referencia(p: { id: number }): string {
  return `REF-${String(p.id).padStart(4, "0")}`;
}

/**
 * Specs técnicas con valor, para tarjeta y ficha (un generador no tiene
 * "alcance", una grúa sí): solo se muestran las que tienen dato.
 */
export function specsDeProducto(p: Producto): { k: string; v: string }[] {
  const specs: { k: string; v: string }[] = [];
  if (p.anio != null) specs.push({ k: "Año", v: String(p.anio) });
  if (p.potencia) specs.push({ k: "Potencia", v: p.potencia });
  if (p.capacidad) specs.push({ k: "Capacidad", v: p.capacidad });
  if (p.alcance) specs.push({ k: "Alcance", v: p.alcance });
  return specs;
}

/** Número de WhatsApp del negocio (formato wa.me, sin "+"). Única fuente. */
export const WHATSAPP_NUMERO = "56933266433";

/** Link wa.me con mensaje pre-armado incluyendo nombre y referencia del equipo. */
export function urlWhatsApp(p: Producto): string {
  const mensaje = `Hola, vi el ${p.nombre} (${referencia(p)}) en el catálogo de maq-usos y me interesa. ¿Sigue disponible?`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
