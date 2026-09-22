import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categorias from "@/components/Categorias";
import Catalogo from "@/components/Catalogo";
import PorQue from "@/components/PorQue";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

// Landing pública migrada desde index.html (roadmap punto 3). Misma estructura
// y clases de index.css (importado como global en app/layout.tsx).
// force-dynamic: el catálogo lee Supabase en cada request, sin caché de Next.
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  // Filtro del catálogo por categoría vía URL (/?cat=Grúas#catalogo).
  const { cat } = await searchParams;

  return (
    <>
      <Header />
      <Hero />
      <Categorias />
      <Catalogo categoriaActiva={cat} />
      <PorQue />
      <CtaBand />
      <Footer />
    </>
  );
}
