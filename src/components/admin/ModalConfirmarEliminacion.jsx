import { useEffect, useRef } from "react";
import Boton from "../ui/Boton";
import { IconoAviso, IconoAlmacen } from "../ui/Iconos";
import { formatearPrecio } from "../../utils/formato";
import "./ModalConfirmarEliminacion.css";

/**
 * A4. Se abre desde A1 (listado) o A2 (detalle) — por eso vive como
 * componente aparte y no como parte de ninguna de las dos páginas.
 * Confirmación real, no un `window.confirm`: nombra el producto y explica
 * qué va a pasar (baja lógica, no borrado), como pide Admin-Estados.dc.html.
 */
function ModalConfirmarEliminacion({ producto, onConfirmar, onCancelar, eliminando }) {
  const botonCancelarRef = useRef(null);

  useEffect(() => {
    botonCancelarRef.current?.focus();

    function manejarTecla(evento) {
      if (evento.key === "Escape") onCancelar();
    }
    document.addEventListener("keydown", manejarTecla);
    return () => document.removeEventListener("keydown", manejarTecla);
  }, [onCancelar]);

  return (
    <div className="modal-fondo" onClick={onCancelar}>
      <div
        className="modal-eliminacion"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-eliminacion-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <span className="modal-eliminacion-icono" aria-hidden="true">
          <IconoAviso width={22} height={22} />
        </span>
        <h2 id="modal-eliminacion-titulo">¿Eliminar este producto?</h2>

        <div className="modal-eliminacion-producto">
          <span className="modal-eliminacion-foto">
            <IconoAlmacen width={22} height={22} />
          </span>
          <div>
            <strong>{producto.nombre}</strong>
            <span>
              {producto.nombreCategoria} · {formatearPrecio(producto.precio)}
            </span>
          </div>
        </div>

        <p>
          <strong>Este producto dejará de mostrarse en la tienda</strong> y los
          clientes no podrán comprarlo.
        </p>
        <p>No se borra de forma definitiva: queda marcado como desactivado en el listado.</p>

        <div className="modal-eliminacion-acciones">
          {/* Botón nativo, no <Boton>: necesita la ref para el foco inicial
           * del modal, y Boton no reenvía refs (no es forwardRef). */}
          <button
            type="button"
            className="boton boton-secundario"
            onClick={onCancelar}
            ref={botonCancelarRef}
            disabled={eliminando}
          >
            Cancelar
          </button>
          <Boton variante="destructivo" onClick={onConfirmar} disabled={eliminando}>
            {eliminando ? "Eliminando…" : "Confirmar eliminación"}
          </Boton>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmarEliminacion;
