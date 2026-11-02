import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { IconoConfirmar, IconoAviso } from "../ui/Iconos";
import "./ToastCarrito.css";

const DURACION_MS = 3500;

/**
 * El aviso "X se agregó al carrito" (Catalogo-Estados.dc.html: "Aparece
 * arriba a la derecha unos segundos y el contador del carrito suma la
 * cantidad"). Se monta una sola vez en LayoutCliente y escucha el aviso que
 * deja CartContext — así funciona igual se agregue desde Inicio, el
 * Catálogo o el Detalle.
 */
function ToastCarrito() {
  const { aviso, limpiarAviso } = useCart();

  useEffect(() => {
    if (!aviso) return undefined;
    const id = setTimeout(limpiarAviso, DURACION_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aviso]);

  if (!aviso) return null;

  const Icono = aviso.variante === "error" ? IconoAviso : IconoConfirmar;

  return (
    <div className="toast-carrito-contenedor" aria-live="polite">
      <div className={`toast-carrito toast-carrito-${aviso.variante}`}>
        <span className="toast-carrito-icono">
          <Icono width={16} height={16} />
        </span>
        {aviso.mensaje}
      </div>
    </div>
  );
}

export default ToastCarrito;
