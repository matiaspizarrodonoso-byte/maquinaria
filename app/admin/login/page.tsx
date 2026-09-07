"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Login del admin con Supabase Auth (email/password).
 * El cliente browser (@supabase/ssr) escribe la sesión en cookies; el
 * servidor la lee con crearClienteServidor() en las páginas /admin.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Si ya hay sesión, ir directo al panel.
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    const { error: errorAuth } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (errorAuth) {
      setError("Credenciales inválidas. Revisá email y contraseña.");
      setCargando(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="container" style={{ maxWidth: "420px" }}>
      <div className="card" style={{ marginTop: "48px" }}>
        <div className="card-body" style={{ padding: "28px" }}>
          <h2 style={{ marginBottom: "18px" }}>Acceso admin</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={cargando}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {cargando ? "Ingresando…" : "Ingresar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
