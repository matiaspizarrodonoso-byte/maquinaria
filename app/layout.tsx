import type { Metadata } from "next";
// CSS global del proyecto (mismas clases y variables del diseño original en index.css).
import "../index.css";

export const metadata: Metadata = {
  title: "maq-usos — Maquinaria pesada certificada",
  description:
    "Compra, reparación y venta de maquinaria pesada usada. Equipos reacondicionados en taller propio, con mantenciones al día y garantía por escrito.",
};

// Fuentes del diseño (mismas que index.html): Oswald para headings,
// IBM Plex Sans para cuerpo, IBM Plex Mono para labels técnicos.
// Se cargan por <link> para que el CSS existente use los nombres de familia tal cual.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
