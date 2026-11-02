import { createContext, useContext, useEffect, useState } from "react";
import * as productosService from "../services/productosService";
import { leer, guardar } from "../utils/almacenLocal";

const CartContext = createContext(null);

const CLAVE_CARRITO = "changuito_carrito";
/* Tope de UX del prototipo (Compra-Estados.dc.html), no una regla del
 * backend: el backend solo valida contra el stock real, sin un máximo fijo.
 * Acá se respetan los dos a la vez — lo que sea más chico. */
export const CANTIDAD_MAXIMA = 12;

/**
 * El carrito guarda solo `{ idProducto, cantidad }` por línea — nunca copia
 * nombre ni precio del producto. Quien necesite mostrar esos datos los pide
 * a productosService en el momento, así nunca se desincroniza con el
 * catálogo. No está atado a ningún usuario: funciona igual logueado o no,
 * como el carrito del backend real, que tampoco reserva stock.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => leer(CLAVE_CARRITO, []));
  /* El aviso ("Yerba mate 500 g se agregó al carrito") vive acá y no en cada
   * página, porque se puede agregar un producto desde Inicio, el Catálogo o
   * el Detalle — un solo lugar para mostrarlo evita repetir la lógica en
   * los tres. Lo consume ToastCarrito, montado una sola vez en LayoutCliente. */
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    guardar(CLAVE_CARRITO, items);
  }, [items]);

  function buscarItem(idProducto) {
    return items.find((item) => item.idProducto === idProducto);
  }

  async function validarCantidad(idProducto, cantidadDeseada) {
    const producto = await productosService.obtener(idProducto);

    if (!producto.disponible) {
      throw new Error(`El producto "${producto.nombre}" no está disponible`);
    }

    const tope = Math.min(CANTIDAD_MAXIMA, producto.stockActual);
    if (cantidadDeseada > tope) {
      throw new Error(
        producto.stockActual < CANTIDAD_MAXIMA
          ? `Solo quedan ${producto.stockActual} unidades de "${producto.nombre}"`
          : `El máximo por compra es ${CANTIDAD_MAXIMA} unidades`,
      );
    }

    return producto;
  }

  /** Suma `cantidad` a lo que ya había en esa línea (o la crea). */
  async function agregar(idProducto, cantidad) {
    const existente = buscarItem(idProducto);
    const cantidadFinal = (existente?.cantidad ?? 0) + cantidad;
    const producto = await validarCantidad(idProducto, cantidadFinal);

    setItems((actuales) => {
      if (existente) {
        return actuales.map((item) =>
          item.idProducto === idProducto
            ? { ...item, cantidad: cantidadFinal }
            : item,
        );
      }
      return [...actuales, { idProducto, cantidad: cantidadFinal }];
    });

    setAviso({
      variante: "exito",
      mensaje:
        cantidad === 1
          ? `${producto.nombre} se agregó al carrito`
          : `Agregaste ${cantidad} unidades de ${producto.nombre} al carrito`,
    });
    return producto;
  }

  /** Reemplaza la cantidad de una línea existente (no la suma). */
  async function actualizarCantidad(idProducto, cantidad) {
    await validarCantidad(idProducto, cantidad);
    setItems((actuales) =>
      actuales.map((item) =>
        item.idProducto === idProducto ? { ...item, cantidad } : item,
      ),
    );
  }

  function quitar(idProducto) {
    setItems((actuales) =>
      actuales.filter((item) => item.idProducto !== idProducto),
    );
  }

  function vaciar() {
    setItems([]);
  }

  const cantidadTotal = items.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cantidadTotal,
        agregar,
        actualizarCantidad,
        quitar,
        vaciar,
        aviso,
        limpiarAviso: () => setAviso(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return contexto;
}
