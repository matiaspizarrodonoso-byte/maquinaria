export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">Maquinaria pesada</div>
          <h2>Equipos que no<br /><em>dejan de trabajar.</em></h2>
          <p className="lead">Especialista en maquinaria pesada usada: compramos, reparamos y reacondicionamos cada equipo en nuestro propio taller. Entregamos unidades con mantenciones al día, componentes revisados y garantía por escrito, para que compres con la confianza de un equipo listo para trabajar.</p>
          <div className="hero-ctas">
            <a href="#catalogo" className="btn btn-amber">Ver catálogo</a>
            <a href="#contacto" className="btn btn-ghost">Solicitar cotización</a>
          </div>
          <div className="stat-row">
            <div className="stat"><div className="num">6</div><div className="lbl">Años de experiencia en reparaciones</div></div>
            <div className="stat"><div className="num">50+</div><div className="lbl">Equipos vendidos</div></div>
            <div className="stat"><div className="num">3</div><div className="lbl">meses de garantía</div></div>
          </div>
        </div>

        <div className="blueprint">
          <svg viewBox="0 0 400 420" fill="none" stroke="#C9CFD3" strokeWidth="1.4">
            <line x1="30" y1="360" x2="370" y2="360" stroke="#E8A33D" strokeOpacity="0.5" strokeDasharray="3 4" />
            <line x1="30" y1="352" x2="30" y2="368" stroke="#E8A33D" strokeOpacity="0.5" />
            <line x1="370" y1="352" x2="370" y2="368" stroke="#E8A33D" strokeOpacity="0.5" />
            <line x1="368" y1="70" x2="368" y2="340" stroke="#E8A33D" strokeOpacity="0.35" strokeDasharray="3 4" />

            <rect x="70" y="344" width="260" height="12" rx="4" />
            <circle cx="100" cy="350" r="8" stroke="#E8A33D" strokeOpacity="0.6" />
            <circle cx="300" cy="350" r="8" stroke="#E8A33D" strokeOpacity="0.6" />

            <rect x="90" y="210" width="220" height="134" rx="8" />

            <rect x="105" y="225" width="85" height="60" rx="4" stroke="#E8A33D" strokeOpacity="0.7" />
            <circle cx="125" cy="245" r="6" stroke="#E8A33D" strokeOpacity="0.8" />
            <circle cx="150" cy="245" r="6" stroke="#E8A33D" strokeOpacity="0.8" />
            <rect x="115" y="260" width="30" height="14" rx="2" stroke="#E8A33D" strokeOpacity="0.6" />

            <line x1="235" y1="228" x2="235" y2="300" stroke="#E8A33D" strokeOpacity="0.4" />
            <line x1="248" y1="228" x2="248" y2="300" stroke="#E8A33D" strokeOpacity="0.4" />
            <line x1="261" y1="228" x2="261" y2="300" stroke="#E8A33D" strokeOpacity="0.4" />
            <line x1="274" y1="228" x2="274" y2="300" stroke="#E8A33D" strokeOpacity="0.4" />
            <line x1="287" y1="228" x2="287" y2="300" stroke="#E8A33D" strokeOpacity="0.4" />

            <circle cx="205" cy="222" r="7" stroke="#E8A33D" strokeOpacity="0.7" />
            <circle cx="205" cy="222" r="2.5" fill="#4B5560" stroke="none" />

            <rect x="270" y="180" width="14" height="32" rx="3" stroke="#E8A33D" strokeOpacity="0.6" />
            <circle cx="277" cy="178" r="5" stroke="#E8A33D" strokeOpacity="0.6" />

            <path d="M150 210 L150 165 Q150 155 160 155 L240 155 Q250 155 250 165 L250 210" strokeWidth="6" strokeLinecap="round" />

            <circle cx="150" cy="210" r="5" fill="#1C2024" stroke="#E8A33D" />
            <circle cx="250" cy="210" r="5" fill="#1C2024" stroke="#E8A33D" />

            <line x1="20" y1="356" x2="380" y2="356" stroke="#4B5560" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  );
}
