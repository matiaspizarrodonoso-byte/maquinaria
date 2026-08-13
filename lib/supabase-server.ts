import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Cliente Supabase para Server Components y Route Handlers.
 * Sigue el patrón oficial de @supabase/ssr: persiste la sesión del admin en
 * cookies (el login del /admin la escribe, este cliente la lee y renueva).
 *
 * Usar este cliente cada vez que haya que verificar sesión o hacer escrituras
 * desde el servidor (ej. route handlers de alta/edición/borrado de productos).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copiá .env.example a .env.local y completá los valores de tu proyecto Supabase."
  );
}

export async function crearClienteServidor() {
  const cookieStore = await cookies();

  // Los guards de arriba garantizan que no son undefined (TS no conserva el
  // narrowing de consts de módulo dentro de funciones async).
  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Llamado desde un Server Component (que no puede escribir cookies).
          // Es seguro ignorarlo: la renovación de sesión se hace en middleware
          // o en route handlers, donde sí se pueden escribir cookies.
        }
      },
    },
  });
}
