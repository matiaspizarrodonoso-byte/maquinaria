import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Cliente Supabase para lectura pública (catálogo), sin cookies ni sesión.
 * Usa la anon key (segura para exponer al cliente): el control de acceso real lo
 * hace Row Level Security en la base (lectura pública solo de productos activos,
 * escritura solo para usuarios autenticados).
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
