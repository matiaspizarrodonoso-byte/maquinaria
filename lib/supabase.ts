import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para el navegador (catálogo público y panel admin client-side).
 * Usa la anon key (segura para exponer al cliente): el control de acceso real lo
 * hace Row Level Security en la base (lectura pública solo de productos activos,
 * escritura solo para usuarios autenticados).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copiá .env.example a .env.local y completá los valores de tu proyecto Supabase."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
