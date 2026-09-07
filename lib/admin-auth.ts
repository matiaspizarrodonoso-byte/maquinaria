import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase-server";

/**
 * Guard de rutas /admin: si no hay sesión válida, redirige al login.
 * Devuelve el cliente servidor autenticado para reusar en la página/acción.
 * getUser() valida el token contra el servidor de Auth (no solo lee el JWT).
 */
export async function requireAdmin() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}
