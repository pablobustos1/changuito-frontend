/**
 * Capa que simula la API de productos. Misma forma que tendría un fetch real
 * (funciones async, demora de red, errores que hay que atrapar) para que
 * reemplazarla por un fetch de verdad el día de la integración sea cambiar
 * este archivo, no los componentes que lo usan.
 *
 * Las operaciones de escritura (crear/actualizar/eliminar) replican las
 * reglas reales de `ProductoService`/`ProductoController` del backend (ver
 * PLAN_FRONTEND.md, paso 7):
 *  - `crear` recibe `stockActual` y calcula `disponible = stockActual > 0`.
 *  - `actualizar` nunca toca `stockActual` ni `disponible`, aunque se los
 *    pasen — el stock solo cambia por eventos de negocio, no a mano.
 *  - `eliminar` es baja lógica (`disponible = false`), nunca saca el
 *    producto del array.
 */
import { PRODUCTOS_SEMILLA } from "../data/productos";
import { CATEGORIAS } from "../data/categorias";
import { leer, guardar } from "../utils/almacenLocal";

const CLAVE = "changuito_productos";
const DEMORA_MS = 400;

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function obtenerTodosSync() {
  return leer(CLAVE, PRODUCTOS_SEMILLA);
}

/** Todos los productos, disponibles o no — para la administración. */
export async function listarTodos() {
  await esperar(DEMORA_MS);
  return obtenerTodosSync();
}

/** Solo los disponibles — el catálogo que ve el cliente. */
export async function listarDisponibles() {
  await esperar(DEMORA_MS);
  return obtenerTodosSync().filter((producto) => producto.disponible);
}

export async function obtener(idProducto) {
  await esperar(DEMORA_MS);
  const producto = obtenerTodosSync().find((p) => p.idProducto === idProducto);
  if (!producto) {
    throw new Error("Producto no encontrado");
  }
  return producto;
}

function _guardarTodos(productos) {
  guardar(CLAVE, productos);
}

function siguienteId(productos) {
  return productos.length ? Math.max(...productos.map((p) => p.idProducto)) + 1 : 1;
}

function nombreCategoria(idCategoria) {
  return CATEGORIAS.find((c) => c.idCategoria === idCategoria)?.nombre ?? "";
}

/** Alta. `datos`: { nombre, detalle, precio, stockActual, idCategoria }. */
export async function crear(datos) {
  await esperar(DEMORA_MS);
  const todos = obtenerTodosSync();

  const nuevo = {
    idProducto: siguienteId(todos),
    nombre: datos.nombre.trim(),
    detalle: datos.detalle.trim(),
    precio: datos.precio,
    stockActual: datos.stockActual,
    disponible: datos.stockActual > 0,
    idCategoria: datos.idCategoria,
    nombreCategoria: nombreCategoria(datos.idCategoria),
    oferta: false,
    imagen: null,
  };

  _guardarTodos([...todos, nuevo]);
  return nuevo;
}

/**
 * Modificación. `datos`: { nombre, detalle, precio, idCategoria } — sin
 * `stockActual`: aunque viniera en el objeto, se ignora a propósito.
 */
export async function actualizar(idProducto, datos) {
  await esperar(DEMORA_MS);
  const todos = obtenerTodosSync();
  const indice = todos.findIndex((p) => p.idProducto === idProducto);
  if (indice < 0) {
    throw new Error("Producto no encontrado");
  }

  const actualizado = {
    ...todos[indice],
    nombre: datos.nombre.trim(),
    detalle: datos.detalle.trim(),
    precio: datos.precio,
    idCategoria: datos.idCategoria,
    nombreCategoria: nombreCategoria(datos.idCategoria),
  };

  const copia = [...todos];
  copia[indice] = actualizado;
  _guardarTodos(copia);
  return actualizado;
}

/** Baja lógica: pasa `disponible` a `false`, nunca saca el producto del listado. */
export async function eliminar(idProducto) {
  await esperar(DEMORA_MS);
  const todos = obtenerTodosSync();
  const indice = todos.findIndex((p) => p.idProducto === idProducto);
  if (indice < 0) {
    throw new Error("Producto no encontrado");
  }
  if (!todos[indice].disponible) {
    throw new Error(`El producto "${todos[indice].nombre}" ya no está disponible`);
  }

  const actualizado = { ...todos[indice], disponible: false };
  const copia = [...todos];
  copia[indice] = actualizado;
  _guardarTodos(copia);
  return actualizado;
}
