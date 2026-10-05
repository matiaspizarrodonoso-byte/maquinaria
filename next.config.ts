import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No anunciar la stack en cada respuesta (X-Powered-By: Next.js).
  poweredByHeader: false,

  // Cabeceras de seguridad para todas las rutas.
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
