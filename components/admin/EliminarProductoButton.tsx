"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eliminarProducto } from "@/app/admin/actions";

/**
 * Botón "Eliminar" de la tabla del admin: abre modal de confirmación
 * (clases .modal/.modal-content de admin.css) y llama a la server action
 * eliminarProducto, que borra archivos de Storage + fila (cascade).
 */
export default function EliminarProductoButton({
  id,
  nombre,
}: {
  id: number;
  nombre: string;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmar() {
    setEnviando(true);
    setError(null);
    const r = await eliminarProducto(id);
    if (!r.ok) {
      setError(r.error);
      setEnviando(false);
      return;
    }
    setAbierto(false);
    setEnviando(false);
    router.refresh();
  }

  return (
    <>
      <button type="button" className="eliminar" onClick={() => setAbierto(true)}>
        Eliminar
      </button>

      {abierto && (
        <div className="modal">
          <div className="modal-backdrop" onClick={() => !enviando && setAbierto(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3>Eliminar producto</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => !enviando && setAbierto(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div style={{ padding: "22px 26px 26px" }}>
              <p style={{ fontSize: "14px", color: "var(--steel)", marginBottom: "8px" }}>
                ¿Eliminar <strong style={{ color: "var(--ink)" }}>{nombre}</strong>?
                Se borran también sus imágenes. Esta acción no se puede deshacer.
              </p>
              {error && <div className="error">{error}</div>}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn"
                  style={{ borderColor: "var(--line)" }}
                  onClick={() => setAbierto(false)}
                  disabled={enviando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmar}
                  disabled={enviando}
                >
                  {enviando ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
