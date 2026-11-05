import { useEffect, useState } from "react";
import { useCart, CANTIDAD_MAXIMA } from "../../context/CartContext";
import Etiqueta from "../ui/Etiqueta";
import { IconoAlmacen, IconoEliminar, IconoAviso } from "../ui/Iconos";
import { formatearPrecio } from "../../utils/formato";
import "./FilaCarrito.css";

/**
 * Una línea del carrito. El campo de cantidad se puede tipear a mano, no
 * solo con los botones +/− (Compra-Estados.dc.html: "2 · Cantidad
 * inválida"). Mientras lo que está tipeado no sea válido, se muestra en
 * rojo y el subtotal queda en guion — pero NUNCA se guarda esa cantidad
 * inválida en el carrito: CartContext solo acepta valores que ya pasaron
 * esta misma validación, así que lo inválido es siempre un estado
 * transitorio de edición, no algo que quede persistido.
 */
function FilaCarrito({ item, producto }) {
  const { actualizarCantidad, quitar } = useCart();
  const [valorCampo, setValorCampo] = useState(String(item.cantidad));
  const [error, setError] = useState(null);

  useEffect(() => {
    setValorCampo(String(item.cantidad));
  }, [item.cantidad]);

  const sinStock = !producto.disponible;

  if (sinStock) {
    return (
      <article className="fila-carrito fila-carrito-no-disponible">
        <div className="fila-carrito-foto">
          {producto.imagen ? (
            <img src={producto.imagen} alt="" />
          ) : (
            <IconoAlmacen width={28} height={28} />
          )}
        </div>
        <div className="fila-carrito-cuerpo">
          <div className="fila-carrito-fila-superior">
            <div>
              <Etiqueta variante="desactivado">No disponible</Etiqueta>
              <h3>{producto.nombre}</h3>
            </div>
            <div className="fila-carrito-subtotal-col">
              <div className="fila-carrito-subtotal">
                <span>Subtotal</span>
                <strong>No se incluye</strong>
              </div>
              <button
                type="button"
                className="fila-carrito-quitar"
                onClick={() => quitar(producto.idProducto)}
              >
                <IconoEliminar width={16} height={16} /> Quitar del carrito
              </button>
            </div>
          </div>
          <p className="fila-carrito-nota">
            Este producto ya no está disponible. No se incluye en el total.
          </p>
          <p className="fila-carrito-precio-unitario">
            Precio unitario: {formatearPrecio(producto.precio)} · Cantidad:{" "}
            {item.cantidad}
          </p>
        </div>
      </article>
    );
  }

  const tope = Math.min(CANTIDAD_MAXIMA, producto.stockActual);

  function validar(valorTexto) {
    const numero = Number(valorTexto);
    if (!Number.isInteger(numero) || numero < 1 || numero > CANTIDAD_MAXIMA) {
      return "Ingresá un número entero entre 1 y 12.";
    }
    if (numero > producto.stockActual) {
      return `Solo quedan ${producto.stockActual} unidades.`;
    }
    return null;
  }

  function manejarCambio(valorTexto) {
    setValorCampo(valorTexto);
    const mensaje = validar(valorTexto);
    setError(mensaje);
    if (!mensaje) {
      const numero = Number(valorTexto);
      if (numero !== item.cantidad) {
        actualizarCantidad(producto.idProducto, numero).catch((e) =>
          setError(e.message),
        );
      }
    }
  }

  function cambiarEn(delta) {
    const base = Number.isInteger(Number(valorCampo)) ? Number(valorCampo) : item.cantidad;
    manejarCambio(String(base + delta));
  }

  const cantidadMostrada = Number(valorCampo);
  const subtotal =
    !error && Number.isFinite(cantidadMostrada)
      ? producto.precio * cantidadMostrada
      : null;

  return (
    <article className={`fila-carrito ${error ? "fila-carrito-con-error" : ""}`}>
      <div className="fila-carrito-foto">
        {producto.imagen ? (
          <img src={producto.imagen} alt="" />
        ) : (
          <IconoAlmacen width={28} height={28} />
        )}
      </div>
      <div className="fila-carrito-cuerpo">
        <div className="fila-carrito-fila-superior">
          <div>
            <h3>{producto.nombre}</h3>
            <p className="fila-carrito-categoria">{producto.nombreCategoria}</p>
          </div>
          <div className="fila-carrito-subtotal-col">
            <div className="fila-carrito-subtotal">
              <span>Subtotal</span>
              <strong>{subtotal === null ? "—" : formatearPrecio(subtotal)}</strong>
            </div>
            <button
              type="button"
              className="fila-carrito-quitar"
              onClick={() => quitar(producto.idProducto)}
            >
              <IconoEliminar width={16} height={16} /> Quitar del carrito
            </button>
          </div>
        </div>

        <p className="fila-carrito-precio-unitario">
          Precio unitario: {formatearPrecio(producto.precio)}
        </p>

        <div className="fila-carrito-controles">
          <span className="fila-carrito-etiqueta-cantidad">Cantidad</span>
          <div className="fila-carrito-selector">
            <button
              type="button"
              aria-label="Restar una unidad"
              onClick={() => cambiarEn(-1)}
              disabled={cantidadMostrada <= 1}
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max={CANTIDAD_MAXIMA}
              value={valorCampo}
              onChange={(evento) => manejarCambio(evento.target.value)}
              aria-label={`Cantidad de ${producto.nombre}`}
              aria-invalid={error ? "true" : undefined}
            />
            <button
              type="button"
              aria-label="Sumar una unidad"
              onClick={() => cambiarEn(1)}
              disabled={cantidadMostrada >= tope}
            >
              +
            </button>
          </div>
          <span className="fila-carrito-maximo">Máximo 12 por compra</span>
        </div>

        {error && (
          <p className="fila-carrito-error" role="alert">
            <IconoAviso width={16} height={16} /> {error}
          </p>
        )}
      </div>
    </article>
  );
}

export default FilaCarrito;
