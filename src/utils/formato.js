/** `4850` -> "$ 4.850", igual al formato del prototipo (punto de miles, sin decimales). */
export function formatearPrecio(valor) {
  const entero = Math.round(valor);
  return `$ ${entero.toLocaleString("es-AR")}`;
}
