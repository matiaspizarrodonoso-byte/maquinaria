import Link from "next/link";

export default function Header() {
  // Links absolutos con anchor ("/#catalogo"): funcionan igual en la home
  // (scroll suave vía CSS) y también desde otras páginas como la ficha.
  return (
    <header>
      <div className="wrap nav">
        <Link href="/" className="logo">
          <span className="dot"></span>Forja
        </Link>
        <nav className="nav-links">
          <Link href="/#catalogo">Catálogo</Link>
          <Link href="/#nosotros">Nosotros</Link>
          {/* Link al panel de admin: descomentar cuando el admin esté listo para publicarse */}
          <Link href="/admin">Admin</Link> 
        </nav>
        <Link href="/#contacto" className="btn btn-amber">contacta ahora</Link>
      </div>
    </header>
  );
}
