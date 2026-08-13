export default function Home() {
  // Placeholder del punto 1 (setup). La migración de la landing pública
  // completa a componentes (Header, Hero, Categorias, Catalogo, PorQue,
  // CtaBand, Footer) es el punto 3 del roadmap.
  return (
    <main className="wrap" style={{ padding: "80px 0" }}>
      <div className="eyebrow">Forja — Maquinaria pesada</div>
      <h1>Setup del proyecto listo</h1>
      <p className="lead" style={{ marginTop: "16px" }}>
        Proyecto Next.js inicializado. La landing pública con catálogo desde
        Supabase se construye en el siguiente paso.
      </p>
    </main>
  );
}
