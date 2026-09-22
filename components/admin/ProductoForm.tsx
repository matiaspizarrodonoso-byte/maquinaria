"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  crearProducto,
  actualizarProducto,
  type ProductoInput,
  type ImagenInput,
} from "@/app/admin/actions";

const MAX_IMAGENES = 3;
const BUCKET = "productos";
const OTRA_CATEGORIA = "__otra__";

export type ImagenExistente = { id: number; url: string; orden: number };

export type ProductoFormInicial = {
  nombre: string;
  descripcion: string;
  precio: string;
  anio: string;
  potencia: string;
  capacidad: string;
  alcance: string;
  activo: boolean;
};

type ItemImagen = {
  key: string;
  id?: number; // fila existente en producto_imagenes
  url?: string; // url pública existente
  file?: File; // archivo nuevo a subir
  preview: string; // url pública u objectURL local
};

const VACIO: ProductoFormInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  anio: "",
  potencia: "",
  capacidad: "",
  alcance: "",
  activo: true,
};

/**
 * Formulario de alta/edición de productos (clases .form-group/.form-row de
 * admin.css). La categoría es un select (lista de la DB + las 5 fijas) con
 * opción "Otra…" para no tipear a mano y evitar errores.
 * Las imágenes se suben directo a Supabase Storage desde el navegador con la
 * sesión del admin y la server action solo recibe las URLs finales en orden.
 */
export default function ProductoForm({
  modo,
  productoId,
  inicial = VACIO,
  categoriaInicial = "",
  categorias,
  imagenesIniciales = [],
}: {
  modo: "nuevo" | "editar";
  productoId?: number;
  inicial?: ProductoFormInicial;
  categoriaInicial?: string;
  categorias: string[];
  imagenesIniciales?: ImagenExistente[];
}) {
  const router = useRouter();
  const [campos, setCampos] = useState<ProductoFormInicial>(inicial);

  const selInicial = !categoriaInicial
    ? ""
    : categorias.includes(categoriaInicial)
      ? categoriaInicial
      : OTRA_CATEGORIA;
  const [catSel, setCatSel] = useState(selInicial);
  const [catOtra, setCatOtra] = useState(
    selInicial === OTRA_CATEGORIA ? categoriaInicial : ""
  );

  const [imagenes, setImagenes] = useState<ItemImagen[]>(
    imagenesIniciales.map((i) => ({
      key: `db-${i.id}`,
      id: i.id,
      url: i.url,
      preview: i.url,
    }))
  );
  const [eliminadas, setEliminadas] = useState<{ id: number; url: string }[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setCampo<K extends keyof ProductoFormInicial>(
    campo: K,
    valor: ProductoFormInicial[K]
  ) {
    setCampos((c) => ({ ...c, [campo]: valor }));
  }

  function agregarImagenes(files: FileList | null) {
    if (!files) return;
    const disponibles = MAX_IMAGENES - imagenes.length;
    const nuevas = Array.from(files)
      .slice(0, disponibles)
      .map((file) => ({
        key: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));
    setImagenes((arr) => [...arr, ...nuevas]);
  }

  function quitarImagen(item: ItemImagen) {
    if (item.id && item.url) {
      setEliminadas((arr) => [...arr, { id: item.id!, url: item.url! }]);
    }
    setImagenes((arr) => arr.filter((i) => i.key !== item.key));
  }

  /** Sube las imágenes nuevas y devuelve la lista final {id?, url} en orden. */
  async function subirNuevas(): Promise<ImagenInput[] | null> {
    const resultado: ImagenInput[] = [];
    for (const item of imagenes) {
      if (item.id && item.url) {
        resultado.push({ id: item.id, url: item.url });
        continue;
      }
      if (!item.file) continue;
      const nombreSeguro = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${nombreSeguro}`;
      const { error: errorUpload } = await supabaseBrowser.storage
        .from(BUCKET)
        .upload(path, item.file);
      if (errorUpload) {
        setError("Error al subir imagen: " + errorUpload.message);
        return null;
      }
      const { data } = supabaseBrowser.storage.from(BUCKET).getPublicUrl(path);
      resultado.push({ url: data.publicUrl });
    }
    return resultado;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const imagenesFinales = await subirNuevas();
    if (!imagenesFinales) {
      setEnviando(false);
      return;
    }

    const input: ProductoInput = {
      nombre: campos.nombre.trim(),
      descripcion: campos.descripcion.trim() || null,
      precio: campos.precio === "" ? null : Number(campos.precio),
      categoria:
        catSel === OTRA_CATEGORIA
          ? catOtra.trim() || null
          : catSel || null,
      anio: campos.anio === "" ? null : Number(campos.anio),
      potencia: campos.potencia.trim() || null,
      capacidad: campos.capacidad.trim() || null,
      alcance: campos.alcance.trim() || null,
      activo: campos.activo ? 1 : 0,
    };

    const r =
      modo === "nuevo"
        ? await crearProducto(input, imagenesFinales)
        : await actualizarProducto(productoId!, input, imagenesFinales, eliminadas);

    if (!r.ok) {
      setError(r.error);
      setEnviando(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-body" style={{ padding: "26px" }}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              id="nombre"
              required
              value={campos.nombre}
              onChange={(e) => setCampo("nombre", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              rows={4}
              value={campos.descripcion}
              onChange={(e) => setCampo("descripcion", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio (CLP)</label>
              <input
                id="precio"
                type="number"
                min="0"
                value={campos.precio}
                onChange={(e) => setCampo("precio", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                value={catSel}
                onChange={(e) => setCatSel(e.target.value)}
              >
                <option value="">— Sin categoría —</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={OTRA_CATEGORIA}>Otra…</option>
              </select>
              {catSel === OTRA_CATEGORIA && (
                <input
                  value={catOtra}
                  onChange={(e) => setCatOtra(e.target.value)}
                  placeholder="Nueva categoría"
                  style={{ marginTop: "8px" }}
                />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="anio">Año</label>
              <input
                id="anio"
                type="number"
                min="1950"
                max="2100"
                value={campos.anio}
                onChange={(e) => setCampo("anio", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="potencia">Potencia</label>
              <input
                id="potencia"
                placeholder="150 HP"
                value={campos.potencia}
                onChange={(e) => setCampo("potencia", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacidad">Capacidad</label>
              <input
                id="capacidad"
                placeholder="2.5 m³"
                value={campos.capacidad}
                onChange={(e) => setCampo("capacidad", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="alcance">Alcance</label>
              <input
                id="alcance"
                placeholder="12 m"
                value={campos.alcance}
                onChange={(e) => setCampo("alcance", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activo">Estado</label>
            <label
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
                textTransform: "none",
                fontFamily: "'IBM Plex Sans'",
                fontSize: "14px",
                color: "var(--ink)",
              }}
            >
              <input
                id="activo"
                type="checkbox"
                checked={campos.activo}
                onChange={(e) => setCampo("activo", e.target.checked)}
                style={{ width: "auto" }}
              />
              Activo (visible en el catálogo público)
            </label>
          </div>

          <div className="form-group">
            <label>Imágenes (máx. {MAX_IMAGENES}, la primera es la portada)</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {imagenes.map((item) => (
                <div key={item.key} style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- preview local/storage; next/image no aplica acá. */}
                  <img
                    src={item.preview}
                    alt=""
                    style={{
                      width: "96px",
                      height: "72px",
                      objectFit: "cover",
                      borderRadius: "3px",
                      display: "block",
                      background: "var(--plate)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => quitarImagen(item)}
                    aria-label="Quitar imagen"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--rust)",
                      color: "#fff",
                      cursor: "pointer",
                      lineHeight: "1",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {imagenes.length < MAX_IMAGENES && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  agregarImagenes(e.target.files);
                  e.target.value = "";
                }}
              />
            )}
            {imagenes.length >= MAX_IMAGENES && (
              <span style={{ fontSize: "12px", color: "var(--steel)", fontFamily: "'IBM Plex Mono'" }}>
                Máximo {MAX_IMAGENES} imágenes por producto.
              </span>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <Link href="/admin" className="btn" style={{ borderColor: "var(--line)" }}>
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando
                ? "Guardando…"
                : modo === "nuevo"
                  ? "Crear producto"
                  : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
