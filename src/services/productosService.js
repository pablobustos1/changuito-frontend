/**
 * Capa que simula la API de productos. Misma forma que tendría un fetch real
 * (funciones async, demora de red, errores que hay que atrapar) para que
 * reemplazarla por un fetch de verdad el día de la integración sea cambiar
 * este archivo, no los componentes que lo usan.
 *
 * Por ahora solo lectura (listar/obtener): lo que necesita CartContext para
 * validar stock. Las operaciones de alta/baja/modificación (crear,
 * actualizar, eliminar) se agregan en el paso de Administración.
 */
import { PRODUCTOS_SEMILLA } from "../data/productos";
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

// Usado internamente por el resto del servicio cuando se agreguen las
// operaciones de escritura (paso de Administración).
export function _guardarTodos(productos) {
  guardar(CLAVE, productos);
}
