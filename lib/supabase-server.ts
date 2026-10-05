import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Cliente Supabase para Server Components y Server Actions.
 * Sigue el patrón oficial de @supabase/ssr: la sesión del admin vive en
 * cookies (el login del /admin la escribe, este cliente la lee y renueva).
 *
 * Usar este cliente cada vez que haya que verificar sesión o hacer escrituras
 * desde el servidor (páginas y server actions del /admin).
 */
export async function crearClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
          // Es seguro ignorarlo: la renovación de sesión la hace proxy.ts
          // en cada request, donde sí se pueden escribir cookies.
        }
      },
    },
  });
}
