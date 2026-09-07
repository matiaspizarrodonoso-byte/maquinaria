// Estilos del panel admin (diseño ya provisto, clases tal cual).
import "../../admin.css";

// Layout de /admin: no usa Header/Footer públicos; cada página admin arma
// su propio chrome (AdminHeader). El login queda sin header.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
