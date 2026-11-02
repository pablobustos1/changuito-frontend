import { IconoAviso, IconoConfirmar, IconoCerrar } from "./Iconos";
import "./Recuadro.css";

const ICONO_POR_VARIANTE = {
  info: IconoAviso,
  error: IconoAviso,
  exito: IconoConfirmar,
};

/**
 * Caja informativa con ícono — la misma pieza visual que el prototipo usa
 * para avisos ("Qué es real y qué es simulado hoy", Nosotros-Escritorio) y
 * para el resumen de error arriba de un formulario (Compra-Estados), solo
 * cambia el color según `variante`. Pasarle una lista adentro (`children`)
 * para el patrón "resumen arriba + cada campo repite su mensaje".
 *
 * `onCerrar`, si se pasa, agrega el botón de cerrar de los avisos de
 * Administración ("Aparecen arriba del listado después de una acción y se
 * pueden cerrar", Admin-Estados.dc.html).
 */
function Recuadro({ variante = "info", titulo, children, onCerrar, className = "" }) {
  const Icono = ICONO_POR_VARIANTE[variante] ?? IconoAviso;

  return (
    <div
      className={`recuadro recuadro-${variante} ${className}`.trim()}
      role={variante === "error" ? "alert" : undefined}
    >
      <Icono className="recuadro-icono" />
      <div className="recuadro-cuerpo">
        {titulo && <p className="recuadro-titulo">{titulo}</p>}
        <div className="recuadro-contenido">{children}</div>
      </div>
      {onCerrar && (
        <button
          type="button"
          className="recuadro-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar aviso"
        >
          <IconoCerrar width={16} height={16} />
        </button>
      )}
    </div>
  );
}

export default Recuadro;
