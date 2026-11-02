import { Link } from "react-router-dom";
import "./Migas.css";

/**
 * Ruta de migas de pan ("Inicio / Productos") — aparece en Catálogo,
 * Contacto y Administración del prototipo. Se reusa en todas las pantallas
 * que no son la portada, incluidas las nuevas (sesión, privacidad).
 *
 * `items`: [{ etiqueta, to? }]. El último no necesita `to` — es la página
 * actual, se marca con aria-current.
 */
function Migas({ items }) {
  return (
    <nav aria-label="Ruta de navegación" className="migas">
      <ol>
        {items.map((item, indice) => {
          const esUltimo = indice === items.length - 1;
          return (
            <li key={item.etiqueta}>
              {esUltimo || !item.to ? (
                <span aria-current={esUltimo ? "page" : undefined}>
                  {item.etiqueta}
                </span>
              ) : (
                <Link to={item.to}>{item.etiqueta}</Link>
              )}
              {!esUltimo && (
                <span aria-hidden="true" className="migas-separador">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Migas;
