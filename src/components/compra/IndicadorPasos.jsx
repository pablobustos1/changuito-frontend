import { IconoConfirmar } from "../ui/Iconos";
import "./IndicadorPasos.css";

const PASOS = ["Carrito", "Datos y pago", "Confirmación"];

/**
 * Los tres pasos de la compra simulada (Compra-Escritorio.dc.html): un
 * círculo lleno con número para el paso activo, un tilde para los ya
 * completados, y el número vacío para los que faltan. Se usa en C4, C5 y C6.
 */
function IndicadorPasos({ pasoActivo }) {
  return (
    <ol className="indicador-pasos">
      {PASOS.map((etiqueta, indice) => {
        const numero = indice + 1;
        const completado = numero < pasoActivo;
        const activo = numero === pasoActivo;
        return (
          <li key={etiqueta}>
            <span
              className={`indicador-pasos-paso ${activo ? "indicador-pasos-activo" : ""} ${completado ? "indicador-pasos-completo" : ""}`.trim()}
            >
              <span className="indicador-pasos-circulo" aria-hidden="true">
                {completado ? <IconoConfirmar width={16} height={16} /> : numero}
              </span>
              <span className="indicador-pasos-etiqueta">{etiqueta}</span>
            </span>
            {numero < PASOS.length && (
              <span className="indicador-pasos-linea" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default IndicadorPasos;
