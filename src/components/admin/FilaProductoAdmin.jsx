import { Link } from "react-router-dom";
import Etiqueta from "../ui/Etiqueta";
import { IconoAlmacen, IconoModificar, IconoEliminar } from "../ui/Iconos";
import { formatearPrecio } from "../../utils/formato";
import "./FilaProductoAdmin.css";

/**
 * Fila de la tabla de Administración (A1). `destacada` es el resaltado
 * transitorio ("fondo verde claro y etiqueta 'Guardado' durante unos
 * segundos", Admin-Estados.dc.html) que pone ListadoProductos después de
 * crear o modificar este producto.
 *
 * Un producto desactivado no tiene Editar ni Eliminar — Admin-Estados.dc.html
 * dice explícitamente que la reactivación no está diseñada en esta etapa,
 * así que una vez desactivado queda fuera de estas dos acciones.
 */
function FilaProductoAdmin({ producto, destacada, onEliminar }) {
  const desactivado = !producto.disponible;

  return (
    <tr className={`fila-producto-admin ${destacada ? "fila-producto-admin-destacada" : ""} ${desactivado ? "fila-producto-admin-desactivada" : ""}`.trim()}>
      <td data-etiqueta="Imagen">
        <span className="fila-producto-admin-foto" aria-hidden="true">
          <IconoAlmacen width={20} height={20} />
        </span>
      </td>
      <td data-etiqueta="Producto">
        <Link to={`/administracion/productos/${producto.idProducto}`}>
          {producto.nombre}
        </Link>
      </td>
      <td data-etiqueta="Categoría">{producto.nombreCategoria}</td>
      <td data-etiqueta="Precio">{formatearPrecio(producto.precio)}</td>
      <td data-etiqueta="Disponibilidad">
        <div className="fila-producto-admin-disponibilidad">
          {destacada ? (
            <Etiqueta variante="guardado">Guardado</Etiqueta>
          ) : (
            <Etiqueta variante={desactivado ? "desactivado" : "disponible"} />
          )}
          <span className="fila-producto-admin-stock">
            Stock: {producto.stockActual} {producto.stockActual === 1 ? "unidad" : "unidades"}
          </span>
        </div>
      </td>
      <td data-etiqueta="Acciones">
        <div className="fila-producto-admin-acciones">
          <Link
            to={`/administracion/productos/${producto.idProducto}/editar`}
            className={`boton boton-secundario ${desactivado ? "fila-producto-admin-accion-inactiva" : ""}`}
            aria-disabled={desactivado || undefined}
            tabIndex={desactivado ? -1 : undefined}
            onClick={(evento) => {
              if (desactivado) evento.preventDefault();
            }}
          >
            <IconoModificar width={16} height={16} /> Editar
          </Link>
          <button
            type="button"
            className="boton boton-destructivo"
            onClick={() => onEliminar(producto)}
            disabled={desactivado}
          >
            <IconoEliminar width={16} height={16} /> Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaProductoAdmin;
