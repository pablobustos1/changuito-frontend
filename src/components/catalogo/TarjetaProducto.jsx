import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Boton from "../ui/Boton";
import Etiqueta from "../ui/Etiqueta";
import { IconoCarrito, IconoConfirmar, IconoAlmacen } from "../ui/Iconos";
import { formatearPrecio } from "../../utils/formato";
import "./TarjetaProducto.css";

/* El estado "Agregado al carrito" de la tarjeta (no el del Detalle, que
 * queda fijo) vuelve solo a normal a los pocos segundos —
 * Catalogo-Estados.dc.html. */
const DURACION_AGREGADO_MS = 2200;

/**
 * Tres estados: normal, agregado (transitorio) y sin stock
 * (Catalogo-Estados.dc.html). La usan Inicio (destacados) y Catálogo.
 */
function TarjetaProducto({ producto }) {
  const { agregar } = useCart();
  const [agregado, setAgregado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const sinStock = !producto.disponible;

  async function manejarAgregar() {
    setEnviando(true);
    try {
      await agregar(producto.idProducto, 1);
      setAgregado(true);
      setTimeout(() => setAgregado(false), DURACION_AGREGADO_MS);
    } catch {
      // El error ya queda visible en el aviso global (ToastCarrito).
    } finally {
      setEnviando(false);
    }
  }

  return (
    <article
      className={`tarjeta-producto ${sinStock ? "tarjeta-producto-sin-stock" : ""}`}
    >
      <div className="tarjeta-producto-foto">
        <IconoAlmacen width={32} height={32} />
        <span>Foto del producto</span>
      </div>

      <div className="tarjeta-producto-textos">
        <div className="tarjeta-producto-estado">
          <Etiqueta
            variante={sinStock ? "sin-stock" : producto.oferta ? "oferta" : "disponible"}
          />
          <span className="tarjeta-producto-categoria">
            {producto.nombreCategoria}
          </span>
        </div>

        <h3>{producto.nombre}</h3>
        <p className="tarjeta-producto-precio">
          {formatearPrecio(producto.precio)}
        </p>
      </div>

      <div className="tarjeta-producto-acciones">
        <Boton variante="secundario" to={`/productos/${producto.idProducto}`}>
          Ver detalle
        </Boton>

        {sinStock ? (
          <button
            type="button"
            className="boton tarjeta-producto-sin-disponible"
            disabled
          >
            No disponible por ahora
          </button>
        ) : agregado ? (
          <button type="button" className="boton tarjeta-producto-agregado" disabled>
            <IconoConfirmar width={18} height={18} /> Agregado al carrito
          </button>
        ) : (
          <Boton variante="acento" onClick={manejarAgregar} disabled={enviando}>
            <IconoCarrito width={18} height={18} /> Agregar al carrito
          </Boton>
        )}
      </div>
    </article>
  );
}

export default TarjetaProducto;
