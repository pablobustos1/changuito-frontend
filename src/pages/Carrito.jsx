import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import * as productosService from "../services/productosService";
import Migas from "../components/ui/Migas";
import EstadoVacio from "../components/ui/EstadoVacio";
import Recuadro from "../components/ui/Recuadro";
import IndicadorPasos from "../components/compra/IndicadorPasos";
import FilaCarrito from "../components/carrito/FilaCarrito";
import ResumenCarrito from "../components/carrito/ResumenCarrito";
import "./Carrito.css";

/**
 * C4. El carrito solo guarda `{idProducto, cantidad}` (ver CartContext), así
 * que acá se resuelve cada línea contra productosService antes de mostrar
 * nada. Eso es lo que hace que un producto dado de baja DESPUÉS de haberlo
 * agregado aparezca solo como "no disponible" en vez de desaparecer o
 * romper la pantalla — no hace falta código extra para ese caso, sale solo
 * de resolver los datos en el momento y no guardarlos.
 */
function Carrito() {
  const { items } = useCart();
  const [productosPorId, setProductosPorId] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    if (items.length === 0) {
      setCargando(false);
      return undefined;
    }

    setCargando(true);
    Promise.all(
      items.map((item) => productosService.obtener(item.idProducto).catch(() => null)),
    ).then((resultados) => {
      if (!vigente) return;
      const mapa = {};
      resultados.forEach((producto, indice) => {
        if (producto) mapa[items[indice].idProducto] = producto;
      });
      setProductosPorId(mapa);
      setCargando(false);
    });

    return () => {
      vigente = false;
    };
  }, [items]);

  const migas = <Migas items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Carrito" }]} />;

  if (!cargando && items.length === 0) {
    return (
      <div className="contenedor pagina-carrito">
        {migas}
        <h1>Tu carrito</h1>
        <IndicadorPasos pasoActivo={1} />
        <EstadoVacio
          titulo="Tu carrito está vacío"
          etiquetaBoton="Ver productos"
          to="/productos"
          varianteBoton="acento"
        >
          Todavía no agregaste productos. Mirá el catálogo y elegí lo que necesites.
        </EstadoVacio>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="contenedor pagina-carrito">
        {migas}
        <p className="pagina-carrito-cargando">Cargando tu carrito…</p>
      </div>
    );
  }

  const itemsResueltos = items
    .map((item) => ({ item, producto: productosPorId[item.idProducto] }))
    .filter((linea) => linea.producto);

  const disponibles = itemsResueltos.filter((linea) => linea.producto.disponible);
  const hayNoDisponibles = itemsResueltos.length > disponibles.length;

  const cantidadUnidades = disponibles.reduce((suma, l) => suma + l.item.cantidad, 0);
  const total = disponibles.reduce(
    (suma, l) => suma + l.item.cantidad * l.producto.precio,
    0,
  );

  return (
    <div className="contenedor pagina-carrito">
      {migas}

      <div className="pagina-carrito-encabezado">
        <h1>Tu carrito</h1>
      </div>

      <IndicadorPasos pasoActivo={1} />

      {hayNoDisponibles && (
        <Recuadro variante="info">
          Hay productos que ya no están disponibles. No se incluyen en el total.
          Podés quitarlos del carrito.
        </Recuadro>
      )}

      <div className="pagina-carrito-grilla">
        <div className="pagina-carrito-lineas">
          {/* Oculto a la vista: el nombre de cada línea es un <h3> (ver
           * FilaCarrito), así que hace falta un <h2> antes. */}
          <h2 className="visualmente-oculto">Productos en el carrito</h2>
          {itemsResueltos.map(({ item, producto }) => (
            <FilaCarrito key={item.idProducto} item={item} producto={producto} />
          ))}
        </div>

        <ResumenCarrito
          cantidadUnidades={cantidadUnidades}
          total={total}
          puedeFinalizar={disponibles.length > 0}
        />
      </div>
    </div>
  );
}

export default Carrito;
