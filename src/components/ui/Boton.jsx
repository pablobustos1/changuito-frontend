import { Link } from "react-router-dom";
import "./Boton.css";

/**
 * Botón con las cinco variantes de Identidad-Componentes.dc.html: una sola
 * acción principal por pantalla, todos de 48px de alto como mínimo.
 *
 *  - principal: Finalizar compra, Guardar cambios, Enviar mensaje.
 *  - acento: solo para sumar productos al carrito, y el llamado de la portada.
 *  - secundario: Volver, cancelar y acciones de apoyo.
 *  - destructivo: solo en administración, siempre con confirmación.
 *  - enlace: navegación liviana dentro de una pantalla.
 *
 * Se usa como botón real (onClick/type), como link externo (href) o como ruta
 * interna (to, vía React Router) — misma apariencia en los tres casos.
 */
function Boton({
  variante = "principal",
  children,
  to,
  href,
  type = "button",
  className = "",
  ...resto
}) {
  const clases = `boton boton-${variante} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={clases} {...resto}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={clases} {...resto}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={clases} {...resto}>
      {children}
    </button>
  );
}

export default Boton;
