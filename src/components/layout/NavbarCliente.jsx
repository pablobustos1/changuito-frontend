import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Boton from "../ui/Boton";
import { IconoCarrito, IconoMenu, IconoCerrar } from "../ui/Iconos";
import pulgar from "../../assets/marca/pulgar.png";
import "./NavbarCliente.css";

/**
 * Barra de navegación del comprador — clara, con el acceso a sesión a la
 * derecha. En mobile los links y las acciones se esconden detrás de un
 * botón de menú (Landing-Movil.dc.html).
 */
function NavbarCliente() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuarioActual, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCart();

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function claseLink({ isActive }) {
    return `navbar-cliente-link ${isActive ? "navbar-cliente-link-activo" : ""}`.trim();
  }

  return (
    <header className="navbar-cliente">
      <div className="contenedor navbar-cliente-barra">
        <Link to="/" className="navbar-cliente-logo" onClick={cerrarMenu}>
          <img src={pulgar} alt="" width="32" height="32" />
          <span>Changuito</span>
        </Link>

        <button
          type="button"
          className="navbar-cliente-boton-menu"
          aria-expanded={menuAbierto}
          aria-controls="navbar-cliente-panel"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
          <span className="visualmente-oculto">Menú</span>
        </button>

        <div
          id="navbar-cliente-panel"
          className={`navbar-cliente-panel ${menuAbierto ? "navbar-cliente-panel-abierto" : ""}`}
        >
          <nav className="navbar-cliente-links" aria-label="Principal">
            <NavLink to="/" end className={claseLink} onClick={cerrarMenu}>
              Inicio
            </NavLink>
            <NavLink to="/productos" className={claseLink} onClick={cerrarMenu}>
              Productos
            </NavLink>
            <NavLink to="/nosotros" className={claseLink} onClick={cerrarMenu}>
              Nosotros
            </NavLink>
            <NavLink to="/contacto" className={claseLink} onClick={cerrarMenu}>
              Contacto
            </NavLink>
          </nav>

          <div className="navbar-cliente-acciones">
            <Link
              to="/carrito"
              className="navbar-cliente-carrito"
              onClick={cerrarMenu}
            >
              <IconoCarrito />
              Carrito
              <span
                className="navbar-cliente-contador"
                aria-label={`${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"} en el carrito`}
              >
                {cantidadTotal}
              </span>
            </Link>

            {usuarioActual ? (
              <div className="navbar-cliente-sesion">
                <span className="navbar-cliente-saludo">
                  Hola, {usuarioActual.nombre}
                </span>
                {usuarioActual.rol === "Administrador" && (
                  <Boton variante="principal" to="/administracion" onClick={cerrarMenu}>
                    Ir a Administración
                  </Boton>
                )}
                <Boton
                  variante="enlace"
                  onClick={() => {
                    cerrarSesion();
                    cerrarMenu();
                  }}
                >
                  Cerrar sesión
                </Boton>
              </div>
            ) : (
              <Boton variante="secundario" to="/iniciar-sesion" onClick={cerrarMenu}>
                Iniciar sesión
              </Boton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarCliente;
