import Migas from "../components/ui/Migas";
import Recuadro from "../components/ui/Recuadro";
import "./PoliticaDePrivacidad.css";

/**
 * L3. Página estática. No estaba en el prototipo original — se agrega
 * porque ahora el registro y el checkout piden datos personales (ver
 * PLAN_FRONTEND.md, desviación 3).
 */
function PoliticaDePrivacidad() {
  return (
    <div className="contenedor pagina-politica">
      <Migas
        items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Política de privacidad" }]}
      />

      <h1>Política de privacidad</h1>
      <p className="pagina-politica-subtitulo">
        En criollo: qué datos pedimos acá adentro y qué hacemos con ellos.
      </p>

      <Recuadro variante="info" titulo="Esto es una simulación académica">
        Changuito es un trabajo práctico de la materia Aplicaciones
        Interactivas (UADE). No hay ningún servidor del otro lado: lo que se
        guarda, se guarda únicamente en el navegador de quien lo usa
        (<code>localStorage</code>), y desaparece si se borran los datos del
        sitio. Nadie más puede verlo, ni nosotros.
      </Recuadro>

      <section>
        <h2>Qué datos pedimos</h2>
        <ul>
          <li>
            <strong>Al registrarte:</strong> nombre, apellido, email, teléfono
            y una contraseña.
          </li>
          <li>
            <strong>Al escribirnos:</strong> tu nombre, tu email y el mensaje
            que nos dejes en Contacto.
          </li>
          <li>
            <strong>Al confirmar una compra simulada:</strong> la forma de
            entrega y, si elegís envío a domicilio, una dirección.
          </li>
        </ul>
      </section>

      <section>
        <h2>Para qué los usamos</h2>
        <p>
          Solo para que la demostración funcione: identificarte dentro de la
          app, mostrar tu nombre en la barra de navegación, y simular el
          resumen de una compra. Nada de esto se analiza, se vende ni se
          comparte con nadie — no hay forma técnica de hacerlo, porque no sale
          de tu navegador.
        </p>
      </section>

      <section>
        <h2>Dónde quedan guardados</h2>
        <p>
          En <code>localStorage</code>, una memoria que el navegador le da a
          cada sitio web. Es lo mismo que usa el carrito para no vaciarse si
          recargás la página. Podés borrarlo vos mismo en cualquier momento
          desde la configuración del navegador.
        </p>
      </section>

      <section>
        <h2>Contraseñas</h2>
        <p>
          Por tratarse de una simulación sin servidor, la contraseña que
          elijas al registrarte queda guardada tal cual la escribiste, sin
          ningún cifrado — algo que una aplicación real nunca debería hacer.
          Por eso te pedimos que <strong>no uses acá una contraseña que
          uses en otro lado</strong>.
        </p>
      </section>
    </div>
  );
}

export default PoliticaDePrivacidad;
