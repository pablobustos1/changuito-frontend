import "./OrdenPorPrecio.css";

/**
 * Dos botones de orden, no un <select> — así resuelve el prototipo
 * (Catalogo-Escritorio.dc.html: "↑ Menor a mayor" / "↓ Mayor a menor").
 * Tocar el que ya está activo lo apaga y vuelve al orden del catálogo.
 */
function OrdenPorPrecio({ orden, onCambiar }) {
  return (
    <div className="orden-precio" role="group" aria-label="Ordenar por precio">
      <button
        type="button"
        className={`orden-precio-boton ${orden === "asc" ? "orden-precio-activo" : ""}`}
        onClick={() => onCambiar(orden === "asc" ? null : "asc")}
        aria-pressed={orden === "asc"}
      >
        ↑ Menor a mayor
      </button>
      <button
        type="button"
        className={`orden-precio-boton ${orden === "desc" ? "orden-precio-activo" : ""}`}
        onClick={() => onCambiar(orden === "desc" ? null : "desc")}
        aria-pressed={orden === "desc"}
      >
        ↓ Mayor a menor
      </button>
    </div>
  );
}

export default OrdenPorPrecio;
