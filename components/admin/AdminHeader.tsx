import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

/** Header oscuro del panel admin (usa .header de admin.css). */
export default function AdminHeader() {
  return (
    <header className="header">
      <h1>Forja Admin</h1>
      <nav style={{ display: "flex", gap: "22px", alignItems: "center" }}>
        <Link href="/admin">Productos</Link>
        <Link href="/">Ver sitio</Link>
        <LogoutButton />
      </nav>
    </header>
  );
}
