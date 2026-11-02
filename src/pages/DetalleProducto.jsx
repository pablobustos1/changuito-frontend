import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as productosService from "../services/productosService";
import { useCart, CANTIDAD_MAXIMA } from "../context/CartContext";
import Boton from "../components/ui/Boton";
import Etiqueta from "../components/ui/Etiqueta";
import Recuadro from "../components/ui/Recuadro";
import {
  IconoAlmacen,
  IconoCarrito,
  IconoConfirmar,
  IconoAviso,
} from "../components/ui/Iconos";
import { formatearPrecio } from "../utils/formato";
import "./DetalleProducto.css";

/**
 * C3. A diferencia de la tarjeta del catálogo, acá "Agregado al carrito" NO
 * vuelve solo a normal: queda con la confirmación hasta que la persona
 * cambie la cantidad o se vaya de la pantalla (Catalogo-Estados.dc.html).
 */
function DetalleProducto() {
  const { id } = useParams();
  const { agregar } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setNoEncontrado(false);
    setAgregado(false);
    setCantidad(1);

    productosService
      .obtener(Number(id))
      .then((datos) => {
        if (vigente) setProducto(datos);
      })
      .catch(() => {
        if (vigente) setNoEncontrado(true);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <div className="contenedor pagina-detalle">
        <p className="pagina-detalle-cargando">Cargando producto…</p>
      </div>
    );
  }

  if (noEncontrado || !producto) {
    return (
      <div className="contenedor pagina-detalle">
        <Recuadro variante="error" titulo="No encontramos este producto">
          Puede que el enlace esté roto o que el producto ya no exista.{" "}
          <a href="/productos">Volvé al catálogo</a>.
        </Recuadro>
      </div>
    );
  }

  const sinStock = !producto.disponible;
  const tope = Math.min(CANTIDAD_MAXIMA, producto.stockActual);

  function restarUno() {
    setCantidad((actual) => Math.max(1, actual - 1));
    setAgregado(false);
  }

  function sumarUno() {
    setCantidad((actual) => Math.min(tope, actual + 1));
    setAgregado(false);
  }

  async function manejarAgregar() {
    setEnviando(true);
    try {
      await agregar(producto.idProducto, cantidad);
      setAgregado(true);
    } catch {
      // El error ya queda visible en el aviso global (ToastCarrito).
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor pagina-detalle">
      <Boton variante="enlace" to="/productos" className="pagina-detalle-volver">
        ← Volver al catálogo
      </Boton>

      <div className="pagina-detalle-grilla">
        <div
          className={`pagina-detalle-foto ${sinStock ? "pagina-detalle-foto-sin-stock" : ""}`}
        >
          <IconoAlmacen width={48} height={48} />
          <p>Foto principal del producto</p>
          <span>Foto de referencia, se reemplaza por la real.</span>
        </div>

        <div className="pagina-detalle-info">
          <div className="pagina-detalle-estado">
            <span className="pagina-detalle-categoria">
              {producto.nombreCategoria}
            </span>
            <Etiqueta variante={sinStock ? "sin-stock" : "disponible"} />
          </div>

          <h1>{producto.nombre}</h1>
          <p className="pagina-detalle-precio">{formatearPrecio(producto.precio)}</p>
          <p className="pagina-detalle-descripcion">{producto.detalle}</p>
          <p className="pagina-detalle-dato-ejemplo">
            Producto, descripción y precio de ejemplo.
          </p>

          {sinStock ? (
            <div className="pagina-detalle-caja-sin-stock">
              <p className="pagina-detalle-aviso-sin-stock">
                <IconoAviso width={18} height={18} />
                Por ahora no tenemos este producto.
              </p>
              <p>Mientras tanto, mirá otros productos del rubro.</p>
              <button type="button" className="boton" disabled>
                No disponible por ahora
              </button>
              <Boton
                variante="secundario"
                to={`/productos?categoria=${producto.idCategoria}`}
              >
                Ver otros productos de {producto.nombreCategoria}
              </Boton>
            </div>
          ) : (
            <div className="pagina-detalle-caja-compra">
              <div className="pagina-detalle-cantidad">
                <span>Cantidad</span>
                <div className="pagina-detalle-selector">
                  <button
                    type="button"
                    aria-label="Restar una unidad"
                    onClick={restarUno}
                    disabled={cantidad <= 1}
                  >
                    −
                  </button>
                  <span aria-live="polite">{cantidad}</span>
                  <button
                    type="button"
                    aria-label="Sumar una unidad"
                    onClick={sumarUno}
                    disabled={cantidad >= tope}
                  >
                    +
                  </button>
                </div>
                <span className="pagina-detalle-total">
                  Total: <strong>{formatearPrecio(producto.precio * cantidad)}</strong>
                </span>
              </div>

              {agregado ? (
                <>
                  <button type="button" className="boton pagina-detalle-boton-agregado" disabled>
                    <IconoConfirmar width={18} height={18} /> Agregado al carrito
                  </button>
                  <div className="pagina-detalle-confirmacion">
                    <IconoConfirmar width={20} height={20} />
                    <div>
                      <p>
                        <strong>¡Listo!</strong> Agregaste {cantidad}{" "}
                        {cantidad === 1 ? "unidad" : "unidades"} de {producto.nombre} al
                        carrito.
                      </p>
                      <Boton variante="secundario" to="/productos">
                        Seguir comprando
                      </Boton>
                    </div>
                  </div>
                </>
              ) : (
                <Boton variante="acento" onClick={manejarAgregar} disabled={enviando}>
                  <IconoCarrito width={18} height={18} /> Agregar al carrito
                </Boton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
