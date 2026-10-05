import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresco de sesión de Supabase en cada request (patrón oficial de
 * @supabase/ssr): el access token dura 1 h; acá se renueva con el refresh
 * token y se re-escriben las cookies, cosa que un Server Component no puede
 * hacer (ver lib/supabase-server.ts). Sin esto, el admin era redirigido al
 * login al expirar el token aunque su sesión siguiera válida.
 *
 * Es solo refresco de sesión: la autorización real la hace requireAdmin() en
 * cada página y server action del /admin (el proxy no es línea de defensa).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() valida el token contra el servidor de Auth y dispara el
  // refresco si está expirado (no usar getSession(), que no valida).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Todo excepto assets estáticos e imágenes públicas (logo.jpg, icon.jpg).
    "/((?!_next/static|_next/image|.*\\.(?:svg|jpg|jpeg|png|webp|gif|ico)$).*)",
  ],
};
