import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

/** Header oscuro del panel admin (usa .header de admin.css). */
export default function AdminHeader() {
  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Logo del admin: click vuelve a la página principal. */}
        <Link href="/" aria-label="maq-usos — volver al sitio">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo provisorio generado. */}
          <img
            src="/logo.jpg"
            alt="maq-usos"
            style={{ height: "75px", borderRadius: "3px", display: "block" }}
          />
        </Link>
        <h1>Admin</h1>
      </div>
      <nav style={{ display: "flex", gap: "22px", alignItems: "center" }}>
        <Link href="/admin">Productos</Link>
        <Link href="/">Ver sitio</Link>
        <LogoutButton />
      </nav>
    </header>
  );
}