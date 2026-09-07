"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Mutaciones del panel admin. Cada acción verifica la sesión (requireAdmin):
 * las Server Actions son endpoints POST alcanzables directamente, no solo
 * desde la UI (guía de seguridad de Next).
 */

export type ProductoInput = {
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: string | null;
  anio: number | null;
  potencia: string | null;
  capacidad: string | null;
  alcance: string | null;
  activo: number; // 1 = activo, 0 = inactivo (respeta el tipo INTEGER del esquema)
};

/** Imagen en el orden final elegido en el formulario. `id` = fila existente. */
export type ImagenInput = { id?: number; url: string };

export type ActionResult = { ok: true; id?: number } | { ok: false; error: string };

const BUCKET = "productos";

/**
 * Extrae el path interno del objeto a partir de la URL pública guardada en DB
 * (decisión de diseño del esquema: el path no se guarda como columna aparte).
 */
function pathDesdeUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

async function borrarObjetosStorage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  urls: string[]
) {
  const paths = urls.map(pathDesdeUrl).filter((p): p is string => p !== null);
  if (paths.length > 0) {
    await supabase.storage.from(BUCKET).remove(paths);
  }
}

export async function crearProducto(
  input: ProductoInput,
  imagenes: ImagenInput[]
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      categoria: input.categoria,
      anio: input.anio,
      potencia: input.potencia,
      capacidad: input.capacidad,
      alcance: input.alcance,
      activo: input.activo,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  if (imagenes.length > 0) {
    const rows = imagenes.map((img, i) => ({
      producto_id: data.id,
      url: img.url,
      orden: i,
    }));
    const { error: errorImagenes } = await supabase
      .from("producto_imagenes")
      .insert(rows);
    if (errorImagenes) return { ok: false, error: errorImagenes.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, id: data.id };
}

export async function actualizarProducto(
  id: number,
  input: ProductoInput,
  imagenes: ImagenInput[],
  eliminadas: { id: number; url: string }[]
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("productos")
    .update({
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      categoria: input.categoria,
      anio: input.anio,
      potencia: input.potencia,
      capacidad: input.capacidad,
      alcance: input.alcance,
      activo: input.activo,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  // Imágenes quitadas en el formulario: borrar objeto de Storage + fila.
  if (eliminadas.length > 0) {
    await borrarObjetosStorage(supabase, eliminadas.map((e) => e.url));
    const { error: e1 } = await supabase
      .from("producto_imagenes")
      .delete()
      .in("id", eliminadas.map((e) => e.id));
    if (e1) return { ok: false, error: e1.message };
  }

  // Orden final: existentes se reordenan, nuevas se insertan (máx. 3 por trigger).
  for (let i = 0; i < imagenes.length; i++) {
    const img = imagenes[i];
    if (img.id) {
      const { error: e2 } = await supabase
        .from("producto_imagenes")
        .update({ orden: i })
        .eq("id", img.id);
      if (e2) return { ok: false, error: e2.message };
    } else {
      const { error: e3 } = await supabase
        .from("producto_imagenes")
        .insert({ producto_id: id, url: img.url, orden: i });
      if (e3) return { ok: false, error: e3.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/catalogo/${id}`);
  return { ok: true, id };
}

export async function eliminarProducto(id: number): Promise<ActionResult> {
  const supabase = await requireAdmin();

  // Primero los archivos de Storage (la FK con ON DELETE CASCADE borra las
  // filas de producto_imagenes, pero NO los objetos del bucket).
  const { data: imagenes } = await supabase
    .from("producto_imagenes")
    .select("url")
    .eq("producto_id", id);

  if (imagenes && imagenes.length > 0) {
    await borrarObjetosStorage(supabase, imagenes.map((i) => i.url));
  }

  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
