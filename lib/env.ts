/**
 * Variables de entorno de Supabase, validadas una sola vez al importar.
 * Cualquier módulo que las necesite las toma de acá en vez de releer
 * process.env (falla rápido y con mensaje claro si faltan).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copiá .env.example a .env.local y completá los valores de tu proyecto Supabase."
  );
}

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;
