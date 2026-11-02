/**
 * Capa que simula el login y el registro del backend real — mismas reglas,
 * sin servidor detrás. Ver PLAN_FRONTEND.md, sección "Autenticación".
 */
import { USUARIOS_SEMILLA } from "../data/usuarios";
import { leer, guardar } from "../utils/almacenLocal";

const CLAVE_USUARIOS = "changuito_usuarios";
const CLAVE_SESION = "changuito_sesion";
const DEMORA_MS = 400;

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function obtenerUsuarios() {
  return leer(CLAVE_USUARIOS, USUARIOS_SEMILLA);
}

function sinContrasena(usuario) {
  const { contrasena: _contrasena, ...resto } = usuario;
  return resto;
}

/**
 * Igual que UsuarioService.autenticar del backend: si el email no existe O
 * la contraseña no coincide, se lanza el MISMO error en los dos casos, para
 * no revelar qué direcciones están registradas.
 */
export async function iniciarSesion(email, contrasena) {
  await esperar(DEMORA_MS);
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (!usuario || usuario.contrasena !== contrasena) {
    throw new Error("Email o contraseña incorrectos");
  }

  const usuarioPublico = sinContrasena(usuario);
  guardar(CLAVE_SESION, usuarioPublico);
  return usuarioPublico;
}

/**
 * Igual que UsuarioService.registrar: rechaza si el email ya existe, y
 * SIEMPRE asigna rol Cliente — el rol nunca llega como dato del formulario.
 */
export async function registrar(datos) {
  await esperar(DEMORA_MS);
  const usuarios = obtenerUsuarios();
  const yaExiste = usuarios.some(
    (u) => u.email.toLowerCase() === datos.email.toLowerCase(),
  );

  if (yaExiste) {
    throw new Error(`Ya existe un usuario registrado con el email ${datos.email}`);
  }

  const nuevoUsuario = {
    idUsuario: Date.now(),
    nombre: datos.nombre,
    apellido: datos.apellido,
    email: datos.email,
    telefono: datos.telefono,
    contrasena: datos.contrasena,
    rol: "Cliente",
  };

  guardar(CLAVE_USUARIOS, [...usuarios, nuevoUsuario]);

  const usuarioPublico = sinContrasena(nuevoUsuario);
  guardar(CLAVE_SESION, usuarioPublico);
  return usuarioPublico;
}

export function cerrarSesion() {
  guardar(CLAVE_SESION, null);
}

/** Lectura sincrónica a propósito: la usa AuthProvider para el estado inicial. */
export function obtenerSesion() {
  return leer(CLAVE_SESION, null);
}
