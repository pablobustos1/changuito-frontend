import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as productosService from "../../services/productosService";
import Migas from "../../components/ui/Migas";
import Boton from "../../components/ui/Boton";
import Recuadro from "../../components/ui/Recuadro";
import FilaProductoAdmin from "../../components/admin/FilaProductoAdmin";
import ModalConfirmarEliminacion from "../../components/admin/ModalConfirmarEliminacion";
import { IconoAlmacen } from "../../components/ui/Iconos";
import "./ListadoProductos.css";

/* El resaltado "Guardado" de una fila recién creada/modificada dura lo
 * mismo que el de la tarjeta "Agregado" del catálogo (TarjetaProducto). */
const DURACION_DESTACADO_MS = 3000;

const FILTROS = [
  { clave: "todos", etiqueta: "Todos" },
  { clave: "disponibles", etiqueta: "Disponibles" },
  { clave: "desactivados", etiqueta: "Desactivados" },
];

const AVISOS = {
  agregado: (nombre) => ({
    variante: "exito",
    titulo: "Producto agregado",
    mensaje: `«${nombre}» ya figura en el listado.`,
  }),
  guardado: (nombre) => ({
    variante: "exito",
    titulo: "Cambios guardados",
    mensaje: `«${nombre}» se actualizó en el listado.`,
  }),
  desactivado: (nombre) => ({
    variante: "info",
    titulo: "Producto desactivado",
    mensaje: `«${nombre}» ya no se muestra en la tienda. Sigue en el listado, marcado como desactivado.`,
  }),
};

/**
 * A1. No es una grilla de tarjetas como el catálogo: es una tabla
 * (Admin-Escritorio.dc.html) — columnas Imagen/Producto/Categoría/Precio/
 * Disponibilidad/Acciones, con pills de filtro con contador arriba.
 *
 * "Sin stock" NO es uno de los filtros, a diferencia del prototipo: en el
 * backend real `disponible` se calcula como `stockActual > 0` al crear y
 * nunca se desincroniza después (acá tampoco, porque el stock no cambia
 * salvo por "Eliminar"), así que un producto con `disponible: true` y stock
 * 0 no es un estado alcanzable — no tenía sentido ofrecer un filtro para
 * algo que nunca va a pasar. Ver PLAN_FRONTEND.md, deviación del paso 7.
 */
function ListadoProductos() {
  const location = useLocation();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [aviso, setAviso] = useState(null);
  const [destacadoId, setDestacadoId] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    productosService.listarTodos().then((lista) => {
      setProductos(lista);
      setCargando(false);
    });
  }, []);

  // Aviso + resaltado tras volver de Nuevo/Modificar producto (paso 7).
  useEffect(() => {
    const estado = location.state;
    if (!estado?.accion) return;

    setAviso(AVISOS[estado.accion](estado.nombre));
    setDestacadoId(estado.idProducto);
    navigate(".", { replace: true, state: null });

    const temporizador = setTimeout(() => setDestacadoId(null), DURACION_DESTACADO_MS);
    return () => clearTimeout(temporizador);
  }, [location.state, navigate]);

  const contadores = useMemo(
    () => ({
      todos: productos.length,
      disponibles: productos.filter((p) => p.disponible).length,
      desactivados: productos.filter((p) => !p.disponible).length,
    }),
    [productos],
  );

  const filtrados = useMemo(() => {
    if (filtro === "disponibles") return productos.filter((p) => p.disponible);
    if (filtro === "desactivados") return productos.filter((p) => !p.disponible);
    return productos;
  }, [productos, filtro]);

  async function confirmarEliminacion() {
    setEliminando(true);
    try {
      const actualizado = await productosService.eliminar(productoAEliminar.idProducto);
      setProductos((actuales) =>
        actuales.map((p) => (p.idProducto === actualizado.idProducto ? actualizado : p)),
      );
      setAviso(AVISOS.desactivado(actualizado.nombre));
      setDestacadoId(null);
      setProductoAEliminar(null);
    } catch (error) {
      setAviso({ variante: "error", mensaje: error.message });
    } finally {
      setEliminando(false);
    }
  }

  const migas = (
    <Migas
      items={[{ etiqueta: "Administración", to: "/administracion" }, { etiqueta: "Productos" }]}
    />
  );

  return (
    <div className="contenedor pagina-admin-listado">
      {migas}

      <div className="pagina-admin-listado-encabezado">
        <div>
          <h1>Administración de productos</h1>
          <p>Editá los datos de cada producto o desactivalo del catálogo de la tienda.</p>
        </div>
        <Boton variante="principal" to="/administracion/productos/nuevo">
          + Agregar producto
        </Boton>
      </div>

      {aviso && (
        <Recuadro variante={aviso.variante} titulo={aviso.titulo} onCerrar={() => setAviso(null)}>
          {aviso.mensaje}
        </Recuadro>
      )}

      <div className="pagina-admin-listado-filtros">
        {FILTROS.map(({ clave, etiqueta }) => (
          <button
            key={clave}
            type="button"
            className={`pagina-admin-listado-pill ${filtro === clave ? "pagina-admin-listado-pill-activa" : ""}`}
            aria-pressed={filtro === clave}
            onClick={() => setFiltro(clave)}
          >
            {etiqueta}
            <span>{contadores[clave]}</span>
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="pagina-admin-listado-cargando">Cargando productos…</p>
      ) : filtrados.length === 0 ? (
        <p className="pagina-admin-listado-vacio">
          <IconoAlmacen width={20} height={20} /> No hay productos en este estado.
        </p>
      ) : (
        <div className="pagina-admin-listado-tabla-envoltorio">
          <table className="pagina-admin-listado-tabla">
            <thead>
              <tr>
                <th scope="col">Imagen</th>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col">Disponibilidad</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((producto) => (
                <FilaProductoAdmin
                  key={producto.idProducto}
                  producto={producto}
                  destacada={producto.idProducto === destacadoId}
                  onEliminar={setProductoAEliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="pagina-admin-listado-nota">
        <strong>Eliminar no borra el producto.</strong> Es una baja lógica: el
        producto queda desactivado y deja de mostrarse en el catálogo del
        comprador, pero sigue en este listado.
      </p>

      {productoAEliminar && (
        <ModalConfirmarEliminacion
          producto={productoAEliminar}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setProductoAEliminar(null)}
          eliminando={eliminando}
        />
      )}
    </div>
  );
}

export default ListadoProductos;
