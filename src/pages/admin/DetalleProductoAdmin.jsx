import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as productosService from "../../services/productosService";
import Migas from "../../components/ui/Migas";
import Boton from "../../components/ui/Boton";
import Etiqueta from "../../components/ui/Etiqueta";
import Recuadro from "../../components/ui/Recuadro";
import ModalConfirmarEliminacion from "../../components/admin/ModalConfirmarEliminacion";
import { IconoAlmacen, IconoModificar, IconoEliminar } from "../../components/ui/Iconos";
import { formatearPrecio } from "../../utils/formato";
import "./DetalleProductoAdmin.css";

/** A2. "Ficha completa del producto con los botones Modificar y Eliminar". */
function DetalleProductoAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setNoEncontrado(false);

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

  async function confirmarEliminacion() {
    setEliminando(true);
    try {
      await productosService.eliminar(producto.idProducto);
      navigate("/administracion", {
        replace: true,
        state: { accion: "desactivado", nombre: producto.nombre, idProducto: producto.idProducto },
      });
    } catch (error) {
      setErrorEliminar(error.message);
      setEliminando(false);
      setModalAbierto(false);
    }
  }

  const migas = (
    <Migas
      items={[
        { etiqueta: "Administración", to: "/administracion" },
        { etiqueta: "Productos", to: "/administracion" },
        { etiqueta: producto?.nombre ?? "Detalle" },
      ]}
    />
  );

  if (cargando) {
    return (
      <div className="contenedor pagina-admin-detalle">
        {migas}
        <p className="pagina-admin-detalle-cargando">Cargando producto…</p>
      </div>
    );
  }

  if (noEncontrado || !producto) {
    return (
      <div className="contenedor pagina-admin-detalle">
        {migas}
        <Recuadro variante="error" titulo="No encontramos este producto">
          Puede que el enlace esté roto o que el producto no exista. Volvé al{" "}
          <a href="/administracion">listado de productos</a>.
        </Recuadro>
      </div>
    );
  }

  const desactivado = !producto.disponible;

  return (
    <div className="contenedor pagina-admin-detalle">
      {migas}

      <div className="pagina-admin-detalle-grilla">
        <div
          className={`pagina-admin-detalle-foto ${desactivado ? "pagina-admin-detalle-foto-desactivada" : ""}`}
        >
          <IconoAlmacen width={44} height={44} />
          <p>Foto del producto</p>
        </div>

        <div className="pagina-admin-detalle-info">
          <div className="pagina-admin-detalle-estado">
            <span className="pagina-admin-detalle-categoria">
              {producto.nombreCategoria}
            </span>
            <Etiqueta variante={desactivado ? "desactivado" : "disponible"} />
          </div>

          <h1 className={desactivado ? "pagina-admin-detalle-nombre-desactivado" : ""}>
            {producto.nombre}
          </h1>
          <p className="pagina-admin-detalle-precio">{formatearPrecio(producto.precio)}</p>
          <p className="pagina-admin-detalle-descripcion">{producto.detalle}</p>
          <p className="pagina-admin-detalle-stock">
            Stock: {producto.stockActual}{" "}
            {producto.stockActual === 1 ? "unidad" : "unidades"}
          </p>

          {errorEliminar && <Recuadro variante="error">{errorEliminar}</Recuadro>}

          {desactivado ? (
            <Recuadro variante="info">
              Este producto está desactivado: no se muestra en la tienda y no
              se puede modificar ni eliminar de nuevo.
            </Recuadro>
          ) : (
            <div className="pagina-admin-detalle-acciones">
              <Boton
                variante="secundario"
                to={`/administracion/productos/${producto.idProducto}/editar`}
              >
                <IconoModificar width={18} height={18} /> Modificar
              </Boton>
              <Boton variante="destructivo" onClick={() => setModalAbierto(true)}>
                <IconoEliminar width={18} height={18} /> Eliminar
              </Boton>
            </div>
          )}
        </div>
      </div>

      {modalAbierto && (
        <ModalConfirmarEliminacion
          producto={producto}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setModalAbierto(false)}
          eliminando={eliminando}
        />
      )}
    </div>
  );
}

export default DetalleProductoAdmin;
