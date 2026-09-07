import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para el navegador CON cookies (@supabase/ssr).
 * A diferencia de lib/supabase.ts (solo lectura pública), este escribe la
 * sesión en cookies para que el servidor la lea vía crearClienteServidor().
 * Usarlo en: login/logout del admin y subida de imágenes desde el navegador
 * (la policy de Storage exige rol authenticated).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copiá .env.example a .env.local y completá los valores de tu proyecto Supabase."
  );
}

export const supabaseBrowser = createBrowserClient(supabaseUrl, supabaseAnonKey);
