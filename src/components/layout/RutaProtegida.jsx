import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protege una rama de rutas. Sin sesión, redirige a /iniciar-sesion (y
 * guarda a dónde se quería ir, en `location.state.desde`, para volver ahí
 * después de loguearse). Si se pide un rol puntual y no coincide, redirige
 * igual — así /administracion nunca es alcanzable sin loguearse como
 * Administrador, ni por error ni escribiendo la URL a mano.
 */
function RutaProtegida({ rolRequerido, children }) {
  const { usuarioActual } = useAuth();
  const ubicacion = useLocation();

  const sinSesion = !usuarioActual;
  const rolNoCoincide = rolRequerido && usuarioActual?.rol !== rolRequerido;

  if (sinSesion || rolNoCoincide) {
    return <Navigate to="/iniciar-sesion" state={{ desde: ubicacion }} replace />;
  }

  return children;
}

export default RutaProtegida;
