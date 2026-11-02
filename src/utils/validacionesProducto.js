/**
 * Validaciones de Nuevo/Modificar producto (A3/A5) — mensajes copiados tal
 * cual de `Admin-Estados.dc.html`: "Las mismas reglas valen para Modificar
 * y para Agregar producto". El límite de 150 para el nombre y 200 para la
 * descripción no está en el prototipo, pero sí en `ProductoRequest` del
 * backend real — se agrega para no poder guardar algo que el backend
 * rechazaría el día de la integración.
 */
const PATRON_PRECIO = /^\d+(,\d{1,2})?$/;

export function validarNombreProducto(valor) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "Ingresá el nombre del producto.";
  if (limpio.length < 3) return "El nombre tiene que tener al menos 3 caracteres.";
  if (limpio.length > 150) return "El nombre no puede superar los 150 caracteres.";
  return null;
}

export function validarCategoriaProducto(idCategoria) {
  if (!idCategoria) return "Elegí una categoría.";
  return null;
}

/** Acepta "2350" o "2350,50" (coma decimal, como pide el prototipo). */
export function parsearPrecio(texto) {
  const limpio = (texto ?? "").trim();
  if (!PATRON_PRECIO.test(limpio)) return null;
  return Number(limpio.replace(",", "."));
}

export function validarPrecioProducto(texto) {
  const limpio = (texto ?? "").trim();
  if (!limpio) return "Ingresá el precio.";
  if (!PATRON_PRECIO.test(limpio)) {
    return "Ingresá solo números, por ejemplo 2350 o 2350,50.";
  }
  if (parsearPrecio(limpio) <= 0) return "El precio tiene que ser mayor a 0.";
  return null;
}

export function validarDescripcionProducto(valor) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "Escribí una descripción corta del producto.";
  if (limpio.length < 10) {
    return "La descripción tiene que tener al menos 10 caracteres.";
  }
  if (limpio.length > 200) {
    return "La descripción no puede superar los 200 caracteres.";
  }
  return null;
}

/* Solo para Nuevo producto (A5) — Modificar nunca pide stock, ver
 * PLAN_FRONTEND.md, deviación del stock en el alta. */
export function validarStockInicial(texto) {
  const limpio = (texto ?? "").trim();
  if (!limpio) return "Ingresá el stock inicial.";
  if (!/^\d+$/.test(limpio)) return "Ingresá un número entero, sin decimales.";
  return null;
}
