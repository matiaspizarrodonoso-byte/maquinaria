import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ color: "#EDEAE2", marginBottom: "14px" }}><span className="dot"></span>Forja</div>
            <p style={{ maxWidth: "280px", fontSize: "13.5px", lineHeight: "1.6" }}>Compra, reparación y venta de maquinaria pesada de segunda mano, con reacondicionamiento en taller propio y garantía por escrito.</p>
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
              <li>ventas@forja-maquinaria.cl</li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Forja Maquinaria. Todos los derechos reservados.</span>
          <span>Versión beta del sitio</span>
        </div>
      </div>
    </footer>
  );
}
