import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ marginBottom: "14px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- logo provisorio generado. */}
              <img src="/logo.jpg" alt="maq-usos" style={{ height: "52px" }} />
            </div>
            <p style={{ maxWidth: "280px", fontSize: "13.5px", lineHeight: "1.6" }}>Compra, reparación y venta de maquinaria pesada de segunda mano, con reacondicionamiento en taller propio y garantía.</p>
          </div>
          <div>
            <h4>Empresa</h4>
            <ul>
              <li><Link href="/#nosotros">Nosotros</Link></li>
              <li><Link href="/#catalogo">Catálogo</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>maq.usos@gmail.com</li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 maq-usos. Todos los derechos reservados.</span>
          <span>Versión beta del sitio</span>
        </div>
      </div>
    </footer>
  );
}
