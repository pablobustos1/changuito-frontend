import Migas from "../components/ui/Migas";
import Recuadro from "../components/ui/Recuadro";
import Boton from "../components/ui/Boton";
import {
  IconoAlmacen,
  IconoAviso,
  IconoCarrito,
  IconoModificar,
  IconoPersona,
} from "../components/ui/Iconos";
import pulgar from "../assets/marca/pulgar.png";
import "./Nosotros.css";

const QUE_ES = [
  {
    Icono: IconoAlmacen,
    titulo: "Qué es Changuito",
    texto:
      "Es un proyecto de comercio electrónico que lleva la experiencia del almacén de barrio al mundo digital. Se desarrolla como trabajo de la materia Aplicaciones Interactivas, en UADE.",
  },
  {
    Icono: IconoAviso,
    titulo: "Qué problema busca resolver",
    texto:
      "Que encontrar productos cotidianos y comprarlos sea simple, rápido y accesible, sin perder la cercanía del almacén de barrio.",
  },
  {
    Icono: IconoCarrito,
    titulo: "Propuesta para los compradores",
    texto:
      "Un catálogo con búsqueda por nombre, filtros por rubro y orden por precio, una ficha por producto, un carrito y una compra simulada de principio a fin.",
  },
  {
    Icono: IconoModificar,
    titulo: "Propuesta de gestión para el comercio",
    texto:
      "Herramientas para administrar los productos: ver el listado, modificar sus datos, eliminarlos de forma lógica (se desactivan, no se borran) y agregar nuevos. El stock cambia con las operaciones del negocio, no a mano.",
  },
];

/* Pablo Bustos y Tobias Rossi, los dos integrantes del equipo — a
 * diferencia del prototipo original, acá no queda ningún campo sin
 * completar (ver PLAN_FRONTEND.md, notas del paso 6). */
const EQUIPO = [
  {
    nombre: "Pablo Bustos",
    rol: "Desarrollo full-stack",
    presentacion:
      "Estudiante de Aplicaciones Interactivas (UADE). Trabajó en el backend de Changuito (Spring Boot) y en este frontend, de punta a punta.",
  },
  {
    nombre: "Tobias Rossi",
    rol: "Desarrollo",
    presentacion:
      "Estudiante de Aplicaciones Interactivas (UADE). Participó en el desarrollo de Changuito a lo largo del cuatrimestre.",
  },
];

/** C7. */
function Nosotros() {
  return (
    <div className="pagina-nosotros">
      <div className="contenedor">
        <Migas items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Nosotros" }]} />

        <section className="nosotros-hero">
          <div>
            <span className="nosotros-eyebrow">Nosotros</span>
            <h1>Conocé Changuito</h1>
            <p>
              Changuito es un proyecto de comercio electrónico pensado para
              acercar la experiencia del almacén de barrio al mundo digital.
              Buscamos que encontrar productos cotidianos y realizar compras
              sea simple, rápido y accesible, incorporando herramientas de
              gestión para el comercio.
            </p>
            <span className="nosotros-pill">
              Proyecto universitario · Aplicaciones Interactivas, UADE
            </span>
          </div>
          <div className="nosotros-hero-imagen">
            <img src={pulgar} alt="" width="160" height="160" />
          </div>
        </section>

        <section className="nosotros-seccion">
          <span className="nosotros-eyebrow">Qué es Changuito y qué propone</span>
          <h2>Cuatro respuestas breves</h2>

          <div className="nosotros-grilla-que-es">
            {QUE_ES.map(({ Icono, titulo, texto }) => (
              <div key={titulo} className="nosotros-tarjeta-que-es">
                <span className="nosotros-tarjeta-que-es-icono">
                  <Icono width={22} height={22} />
                </span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
          </div>

          <Recuadro variante="info" titulo="Qué es real y qué es simulado hoy">
            Changuito es un frontend de práctica, sin conexión a ningún
            backend. El catálogo, el carrito, la compra y el panel de
            administración funcionan de principio a fin, pero todo vive en el
            navegador (localStorage): no hay pasarela de pagos, no se procesa
            dinero real y no se guarda ningún pedido en un servidor.
          </Recuadro>
        </section>
      </div>

      <section className="nosotros-equipo">
        <div className="contenedor">
          <span className="nosotros-eyebrow nosotros-eyebrow-claro">Equipo</span>
          <h2>El equipo detrás de Changuito</h2>
          <p className="nosotros-equipo-subtitulo">
            Los dos integrantes del proyecto.
          </p>

          <div className="nosotros-grilla-equipo">
            {EQUIPO.map(({ nombre, rol, presentacion }) => (
              <article key={nombre} className="tarjeta-integrante">
                <div className="tarjeta-integrante-foto">
                  <IconoPersona width={32} height={32} />
                </div>
                <span className="tarjeta-integrante-etiqueta">Nombre completo</span>
                <h3>{nombre}</h3>
                <span className="tarjeta-integrante-etiqueta">
                  Participación en el proyecto
                </span>
                <p className="tarjeta-integrante-rol">{rol}</p>
                <span className="tarjeta-integrante-etiqueta">Presentación</span>
                <p>{presentacion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="contenedor">
        <section className="nosotros-cta">
          <div>
            <h2>¿Tenés una consulta sobre el proyecto?</h2>
            <p>Escribinos desde el formulario de contacto.</p>
          </div>
          <Boton variante="principal" to="/contacto">
            Ir a Contacto →
          </Boton>
        </section>
      </div>
    </div>
  );
}

export default Nosotros;
