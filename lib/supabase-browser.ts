import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Cliente Supabase para el navegador CON cookies (@supabase/ssr).
 * A diferencia de lib/supabase.ts (solo lectura pública), este escribe la
 * sesión en cookies para que el servidor la lea vía crearClienteServidor().
 * Usarlo en: login/logout del admin y subida de imágenes desde el navegador
 * (la policy de Storage exige rol authenticated).
 */
export const supabaseBrowser = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
