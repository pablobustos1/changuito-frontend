import { Link } from "react-router-dom";
import { formatearPrecio } from "../../utils/formato";
import "./ResumenPedido.css";

/**
 * "Resumen del pedido" de Finalizar-compra y Compra-confirmada
 * (Compra-Escritorio.dc.html): cada línea con cantidad × precio unitario y
 * su subtotal, después el total. `conEditar` solo tiene sentido en C5 — en
 * C6 el carrito ya está vacío, no hay nada que editar.
 *
 * `lineas`: [{ idProducto, nombre, cantidad, precio }] — forma plana, la
 * misma que se guarda en el estado de navegación hacia Compra-confirmada.
 */
function ResumenPedido({ lineas, total, conEditar = false }) {
  return (
    <aside className="resumen-pedido">
      <h2>Resumen del pedido</h2>

      <ul className="resumen-pedido-lista">
        {lineas.map(({ idProducto, nombre, cantidad, precio }) => (
          <li key={idProducto}>
            <div className="resumen-pedido-linea-texto">
              <span className="resumen-pedido-nombre">{nombre}</span>
              <span className="resumen-pedido-detalle">
                {cantidad} × {formatearPrecio(precio)}
              </span>
            </div>
            <span className="resumen-pedido-subtotal">
              {formatearPrecio(cantidad * precio)}
            </span>
          </li>
        ))}
      </ul>

      <div className="resumen-pedido-total">
        <span>Total</span>
        <strong>{formatearPrecio(total)}</strong>
      </div>

      {conEditar && (
        <Link to="/carrito" className="resumen-pedido-editar">
          Editar carrito
        </Link>
      )}

      <p className="resumen-pedido-disclaimer">
        Precios de ejemplo. Compra simulada: no se procesa dinero real.
      </p>
    </aside>
  );
}

export default ResumenPedido;
