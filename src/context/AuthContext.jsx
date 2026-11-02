import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

/**
 * Sesión del usuario actual. `usuarioActual` es null si nadie inició sesión,
 * o `{ idUsuario, nombre, apellido, email, telefono, rol }` si sí (nunca
 * incluye la contraseña — authService ya la saca antes de devolver nada).
 */
export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(() =>
    authService.obtenerSesion(),
  );

  async function iniciarSesion(email, contrasena) {
    const usuario = await authService.iniciarSesion(email, contrasena);
    setUsuarioActual(usuario);
    return usuario;
  }

  async function registrar(datos) {
    const usuario = await authService.registrar(datos);
    setUsuarioActual(usuario);
    return usuario;
  }

  function cerrarSesion() {
    authService.cerrarSesion();
    setUsuarioActual(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuarioActual, iniciarSesion, registrar, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return contexto;
}
