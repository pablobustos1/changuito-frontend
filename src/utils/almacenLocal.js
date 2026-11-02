/**
 * Envoltorio chico sobre localStorage. Lo usan todos los servicios
 * (productosService, authService) para no repetir el try/catch en cada uno:
 * localStorage puede fallar (modo privado, storage lleno, navegador viejo) y
 * eso nunca debería tirar abajo la app — en el peor caso, se pierde la
 * persistencia entre recargas, no la funcionalidad.
 */

export function leer(clave, porDefecto) {
  try {
    const crudo = window.localStorage.getItem(clave);
    return crudo === null ? porDefecto : JSON.parse(crudo);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Simulación académica: si no se puede guardar, la app sigue andando
    // igual, solo que sin recordar el estado entre recargas.
  }
}
