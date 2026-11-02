/**
 * Funciones de validación puras — reusadas en Registrarse, Iniciar sesión,
 * y más adelante en Contacto, Finalizar compra y los formularios de
 * producto de administración. Cada una devuelve el mensaje de error (texto
 * del prototipo cuando existe) o `null` si el valor es válido.
 *
 * Las reglas de email/teléfono/contraseña replican EXACTO las anotaciones
 * de Bean Validation del backend real (UsuarioRegistroRequest) — ver
 * PLAN_FRONTEND.md, tabla de validaciones de Registrarse.
 */

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_TELEFONO = /^\d{10}$/;

export function validarObligatorio(valor, mensaje) {
  if (!valor || !valor.trim()) return mensaje;
  return null;
}

export function validarTexto(valor, { campo, max }) {
  if (!valor || !valor.trim()) return `El ${campo} es obligatorio`;
  if (max && valor.trim().length > max) {
    return `El ${campo} no puede superar los ${max} caracteres`;
  }
  return null;
}

export function validarEmail(valor, { max } = {}) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "El email es obligatorio";
  if (!PATRON_EMAIL.test(limpio)) return "El email no tiene un formato válido";
  if (max && limpio.length > max) {
    return `El email no puede superar los ${max} caracteres`;
  }
  return null;
}

export function validarTelefono(valor) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "El teléfono es obligatorio";
  if (!PATRON_TELEFONO.test(limpio)) {
    return "El teléfono debe tener exactamente 10 dígitos, solo números";
  }
  return null;
}

export function validarContrasena(valor) {
  if (!valor) return "La contraseña es obligatoria";
  if (valor.length < 6 || valor.length > 100) {
    return "La contraseña debe tener entre 6 y 100 caracteres";
  }
  return null;
}

/**
 * Junta un objeto de { campo: mensajeOrNull } y devuelve solo los que
 * tienen error — lo que usan los formularios para decidir si pueden
 * enviarse y para armar el resumen de arriba.
 */
export function sinVacios(objetoErrores) {
  return Object.fromEntries(
    Object.entries(objetoErrores).filter(([, mensaje]) => mensaje),
  );
}
