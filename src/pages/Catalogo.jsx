import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as productosService from "../services/productosService";
import { CATEGORIAS } from "../data/categorias";
import Migas from "../components/ui/Migas";
import EstadoVacio from "../components/ui/EstadoVacio";
import TarjetaProducto from "../components/catalogo/TarjetaProducto";
import Buscador from "../components/catalogo/Buscador";
import FiltroCategoria from "../components/catalogo/FiltroCategoria";
import OrdenPorPrecio from "../components/catalogo/OrdenPorPrecio";
import "./Catalogo.css";

/**
 * C2. El catálogo del cliente: solo productos disponibles
 * (CONTEXTO_NEGOCIO.md §3.2 del backend). Búsqueda, orden por precio y
 * filtro por categoría, todo del lado del cliente sobre una sola carga.
 */
function Catalogo() {
  const [parametros, setParametros] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState(null);

  const categoriaParam = parametros.get("categoria");
  const categoriaActiva = categoriaParam ? Number(categoriaParam) : null;

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    productosService.listarDisponibles().then((datos) => {
      if (vigente) {
        setProductos(datos);
        setCargando(false);
      }
    });
    return () => {
      vigente = false;
    };
  }, []);

  function cambiarCategoria(idCategoria) {
    if (idCategoria === null) {
      setParametros({});
    } else {
      setParametros({ categoria: String(idCategoria) });
    }
  }

  const conteos = useMemo(() => {
    const mapa = {};
    for (const producto of productos) {
      mapa[producto.idCategoria] = (mapa[producto.idCategoria] ?? 0) + 1;
    }
    return mapa;
  }, [productos]);

  const filtrados = useMemo(() => {
    let lista = productos;

    if (categoriaActiva !== null) {
      lista = lista.filter((p) => p.idCategoria === categoriaActiva);
    }

    const busquedaLimpia = busqueda.trim().toLowerCase();
    if (busquedaLimpia) {
      lista = lista.filter((p) => p.nombre.toLowerCase().includes(busquedaLimpia));
    }

    if (orden === "asc") {
      lista = [...lista].sort((a, b) => a.precio - b.precio);
    } else if (orden === "desc") {
      lista = [...lista].sort((a, b) => b.precio - a.precio);
    }

    return lista;
  }, [productos, categoriaActiva, busqueda, orden]);

  const categoriaNombre = categoriaActiva
    ? CATEGORIAS.find((c) => c.idCategoria === categoriaActiva)?.nombre
    : null;

  return (
    <div className="contenedor pagina-catalogo">
      <Migas items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Productos" }]} />

      <div className="pagina-catalogo-encabezado">
        <div>
          <h1>Nuestros productos</h1>
          <p>Elegí por rubro, buscá por nombre o ordená por precio.</p>
        </div>
      </div>

      <div className="pagina-catalogo-controles">
        <Buscador valor={busqueda} onCambiar={setBusqueda} />
        <OrdenPorPrecio orden={orden} onCambiar={setOrden} />
      </div>

      <FiltroCategoria
        categorias={CATEGORIAS}
        categoriaActiva={categoriaActiva}
        onCambiar={cambiarCategoria}
        conteos={conteos}
        total={productos.length}
      />

      {/* Oculto a la vista: el nombre de cada producto es un <h3> (ver
       * TarjetaProducto), así que hace falta un <h2> antes para no saltear
       * un nivel de la jerarquía de encabezados. */}
      <h2 className="visualmente-oculto">Resultados</h2>

      {!cargando && (
        <p className="pagina-catalogo-resultado">
          Mostrando {filtrados.length} de {productos.length} productos
        </p>
      )}

      {cargando ? (
        <p className="pagina-catalogo-cargando">Cargando productos…</p>
      ) : filtrados.length === 0 ? (
        busqueda.trim() ? (
          <EstadoVacio
            titulo={`No encontramos productos para "${busqueda.trim()}"`}
            etiquetaBoton="Limpiar búsqueda"
            onClick={() => setBusqueda("")}
          >
            Revisá que esté bien escrito o probá con otra palabra.
          </EstadoVacio>
        ) : (
          <EstadoVacio
            titulo="No hay productos para mostrar"
            etiquetaBoton="Ver todos los productos"
            onClick={() => cambiarCategoria(null)}
          >
            Todavía no hay productos cargados en {categoriaNombre ?? "este rubro"}.
            Mirá los demás rubros del almacén.
          </EstadoVacio>
        )
      ) : (
        <div className="pagina-catalogo-grilla">
          {filtrados.map((producto) => (
            <TarjetaProducto key={producto.idProducto} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
