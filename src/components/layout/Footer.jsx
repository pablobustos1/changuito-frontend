import { Link } from "react-router-dom";
import pulgar from "../../assets/marca/pulgar.png";
import "./Footer.css";

/* Calculado una sola vez al cargar el módulo, no en cada render del
 * componente — evita llamar a `Date` (una función impura) durante el
 * render. */
const ANIO_ACTUAL = new Date().getFullYear();

/**
 * Pie de página — solo del lado del comprador (Mapa-de-pantallas.dc.html:
 * "Solo en el lado del comprador"). Los datos de contacto son ficticios,
 * para que el pie no quede con espacios vacíos.
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-contenido">
        <div className="footer-marca">
          <Link to="/" className="footer-logo">
            <img src={pulgar} alt="" width="28" height="28" />
            <span>Changuito</span>
          </Link>
          <p>Tu almacén de siempre, ahora a un clic.</p>
        </div>

        <nav className="footer-columna" aria-label="Navegación">
          <h2>Navegación</h2>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/productos">Productos</Link>
            </li>
            <li>
              <Link to="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-columna">
          <h2>Contacto</h2>
          <Link to="/contacto" className="footer-boton-contacto">
            Escribinos
          </Link>
          <p className="footer-dato">contacto@changuito.com.ar</p>
          <p className="footer-dato">011 2345-6789</p>
        </div>

        <div className="footer-columna">
          <h2>Información institucional</h2>
          <p className="footer-dato">Almacén Changuito</p>
          <p className="footer-dato">Av. Rivadavia 4850, Caballito, CABA</p>
          <p className="footer-dato">Lunes a sábado, de 9 a 20 h</p>
        </div>
      </div>

      <div className="contenedor footer-barra-inferior">
        <p>
          © {ANIO_ACTUAL} Changuito · Trabajo práctico de Aplicaciones
          Interactivas, UADE
        </p>
        <nav aria-label="Legal">
          <Link to="/politica-de-privacidad">Política de privacidad</Link>
          <Link to="/administracion">Administración</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
