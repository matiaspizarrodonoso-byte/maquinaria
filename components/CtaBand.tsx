import { WHATSAPP_NUMERO } from "@/lib/productos";

export default function CtaBand() {
  return (
    <section className="cta-band" id="contacto">
      <div className="wrap cta-inner">
        <h2>¿Buscas un equipo para tu próximo proyecto?</h2>
        <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener" className="btn">Numero de contacto</a>
      </div>
    </section>
  );
}
