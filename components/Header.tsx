import Link from "next/link";

export default function Header() {
  // Links absolutos con anchor ("/#catalogo"): funcionan igual en la home
  // (scroll suave vía CSS) y también desde otras páginas como la ficha.
  // Logo en public/logo-maq-uso.png; la placa con
  // borde fino la estiliza .logo img en index.css.
  return (
    <header>
      <div className="wrap nav">
        {/* #top: fragmento especial HTML — en la home sube al tope (suave vía
            scroll-behavior del CSS); desde una ficha lleva a la home. */}
        <Link href="/#top" className="logo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- logo provisorio generado. */}
        <img
          src="/logo-maq-uso.png"
          alt="MAQ USO"
          style={{ height: "75px", display: "block" }}
        />
        </Link>
        <nav className="nav-links">
          <Link href="/#catalogo">Catálogo</Link>
          <Link href="/#nosotros">Nosotros</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <Link href="/#contacto" className="btn btn-amber">contacta ahora</Link>
      </div>
    </header>
  );
}
