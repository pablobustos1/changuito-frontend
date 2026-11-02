import { IconoAviso } from "./Iconos";
import "./Recuadro.css";

/**
 * Caja informativa con ícono — la misma pieza visual que el prototipo usa
 * para avisos ("Qué es real y qué es simulado hoy", Nosotros-Escritorio) y
 * para el resumen de error arriba de un formulario (Compra-Estados), solo
 * cambia el color según `variante`. Pasarle una lista adentro (`children`)
 * para el patrón "resumen arriba + cada campo repite su mensaje".
 */
function Recuadro({ variante = "info", titulo, children, className = "" }) {
  return (
    <div
      className={`recuadro recuadro-${variante} ${className}`.trim()}
      role={variante === "error" ? "alert" : undefined}
    >
      <IconoAviso className="recuadro-icono" />
      <div className="recuadro-cuerpo">
        {titulo && <p className="recuadro-titulo">{titulo}</p>}
        <div className="recuadro-contenido">{children}</div>
      </div>
    </div>
  );
}

export default Recuadro;
