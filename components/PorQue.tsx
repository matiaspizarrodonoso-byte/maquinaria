export default function PorQue() {
  return (
    <section className="why" id="nosotros">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Por qué comprar con Forja</h2>
            <p>Cada equipo pasa por un proceso de verificación antes de salir al catálogo.</p>
          </div>
        </div>
        <div className="gauge-grid">
          <div className="gauge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
            <div className="num">100%</div>
            <div className="lbl">Equipos con inspección de 120 puntos</div>
          </div>
          <div className="gauge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></svg>
            <div className="num">72 h</div>
            <div className="lbl">Tiempo promedio de respuesta a cotizaciones</div>
          </div>
          <div className="gauge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>
            <div className="num">3 meses</div>
            <div className="lbl">Garantía mecánica en todas las unidades</div>
          </div>
          <div className="gauge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20V10l8-6 8 6v10" /><path d="M9 20v-6h6v6" /></svg>
            <div className="num">6</div>
            <div className="lbl">Regiones con soporte y repuestos en terreno</div>
          </div>
        </div>
      </div>
    </section>
  );
}
