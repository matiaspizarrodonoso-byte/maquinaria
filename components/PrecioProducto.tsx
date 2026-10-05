import { formatearPrecio } from "@/lib/productos";

/**
 * Precio con sufijo ("CLP" o "precio a convenir"), markup .price del mockup.
 * Lo comparten la tarjeta del catálogo y la ficha individual.
 */
export default function PrecioProducto({ precio }: { precio: number | null }) {
  return (
    <div className="price">
      {formatearPrecio(precio)}
      <span>{precio != null ? "CLP" : "precio a convenir"}</span>
    </div>
  );
}
