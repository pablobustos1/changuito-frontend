import "./Etiqueta.css";

const TEXTO_POR_DEFECTO = {
  disponible: "Disponible",
  "sin-stock": "Sin stock",
  oferta: "Oferta",
  guardado: "Guardado",
  desactivado: "Desactivado",
};

/**
 * Etiqueta de estado — Disponible / Sin stock / Oferta / Guardado /
 * Desactivado — de Identidad-Componentes.dc.html y Admin-Estados.dc.html.
 */
function Etiqueta({ variante, children }) {
  return (
    <span className={`etiqueta etiqueta-${variante}`}>
      {children ?? TEXTO_POR_DEFECTO[variante]}
    </span>
  );
}

export default Etiqueta;
