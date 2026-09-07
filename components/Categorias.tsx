export default function Categorias() {
  return (
    <section className="cat-section wrap" id="categorias">
      <div className="cat-title">{"// Categorías disponibles"}</div>
      <div className="cat-grid">

        <div className="plate-badge"><span className="rivet tl"></span><span className="rivet tr"></span><span className="rivet bl"></span><span className="rivet br"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="10" width="8" height="6" /><path d="M11 13h6l3-4h-3v4" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
          <div className="name">Cargadores</div>
        </div>
        <div className="plate-badge"><span className="rivet tl"></span><span className="rivet tr"></span><span className="rivet bl"></span><span className="rivet br"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20V6l14 6M4 6l6 3" /><line x1="18" y1="12" x2="18" y2="20" /></svg>
          <div className="name">Grúas</div>
        </div>
        <div className="plate-badge"><span className="rivet tl"></span><span className="rivet tr"></span><span className="rivet bl"></span><span className="rivet br"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><path d="M7 17h6l4-8H9" /></svg>
          <div className="name">Tractores</div>
        </div>
        <div className="plate-badge"><span className="rivet tl"></span><span className="rivet tr"></span><span className="rivet bl"></span><span className="rivet br"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="8" width="16" height="8" rx="1" /><circle cx="8" cy="18" r="2" /><circle cx="16" cy="18" r="2" /></svg>
          <div className="name">Compactadoras</div>
        </div>
        <div className="plate-badge"><span className="rivet tl"></span><span className="rivet tr"></span><span className="rivet bl"></span><span className="rivet br"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="9" width="18" height="9" rx="1" /><circle cx="8" cy="18" r="1.5" /><circle cx="16" cy="18" r="1.5" /><line x1="7" y1="9" x2="7" y2="6" /></svg>
          <div className="name">Generadores</div>
        </div>
      </div>
    </section>
  );
}
