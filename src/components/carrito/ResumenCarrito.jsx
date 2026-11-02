import Boton from "../ui/Boton";
import { formatearPrecio } from "../../utils/formato";
import "./ResumenCarrito.css";

function ResumenCarrito({ cantidadUnidades, total, puedeFinalizar }) {
  return (
    <aside className="resumen-carrito">
      <h2>Resumen</h2>

      <div className="resumen-carrito-linea">
        <span>
          Productos · {cantidadUnidades} {cantidadUnidades === 1 ? "unidad" : "unidades"}
        </span>
        <span>{formatearPrecio(total)}</span>
      </div>

      <div className="resumen-carrito-total">
        <span>Total general</span>
        <strong>{formatearPrecio(total)}</strong>
      </div>

      {puedeFinalizar ? (
        <Boton variante="acento" to="/finalizar-compra" className="resumen-carrito-boton">
          Finalizar compra →
        </Boton>
      ) : (
        <button
          type="button"
          className="boton boton-acento resumen-carrito-boton"
          disabled
        >
          Finalizar compra →
        </button>
      )}

      <Boton variante="secundario" to="/productos" className="resumen-carrito-boton">
        Seguir comprando
      </Boton>

      <p className="resumen-carrito-disclaimer">
        Compra simulada: no se procesa dinero real.
      </p>
    </aside>
  );
}

export default ResumenCarrito;
