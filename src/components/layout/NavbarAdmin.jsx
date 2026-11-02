import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Boton from "../ui/Boton";
import pulgar from "../../assets/marca/pulgar.png";
import "./NavbarAdmin.css";

/**
 * Barra de navegación de administración — verde oscuro, bien distinta de la
 * del comprador para que nunca se confundan (Admin-Escritorio.dc.html). No
 * necesita menú hamburguesa: tiene muchos menos ítems que la del comprador.
 */
function NavbarAdmin() {
  const { usuarioActual, cerrarSesion } = useAuth();

  return (
    <header className="navbar-admin">
      <div className="contenedor navbar-admin-barra">
        <Link to="/administracion" className="navbar-admin-logo">
          <img src={pulgar} alt="" width="28" height="28" />
          <span>Changuito</span>
          <span className="navbar-admin-etiqueta">Administración</span>
        </Link>

        <nav className="navbar-admin-links" aria-label="Administración">
          <NavLink
            to="/administracion"
            end
            className={({ isActive }) =>
              `navbar-admin-link ${isActive ? "navbar-admin-link-activo" : ""}`.trim()
            }
          >
            Productos
          </NavLink>
        </nav>

        <div className="navbar-admin-acciones">
          {usuarioActual && (
            <span className="navbar-admin-saludo">Hola, {usuarioActual.nombre}</span>
          )}
          <Boton variante="enlace" onClick={cerrarSesion} className="navbar-admin-cerrar">
            Cerrar sesión
          </Boton>
          <Boton variante="secundario" to="/" className="navbar-admin-volver">
            ← Volver a la tienda
          </Boton>
        </div>
      </div>
    </header>
  );
}

export default NavbarAdmin;
