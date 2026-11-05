import { useState } from "react";
import Migas from "../components/ui/Migas";
import Recuadro from "../components/ui/Recuadro";
import Boton from "../components/ui/Boton";
import CampoFormulario from "../components/ui/CampoFormulario";
import { IconoCorreo, IconoConfirmar } from "../components/ui/Iconos";
import { PATRON_EMAIL } from "../utils/validaciones";
import "./Contacto.css";

const DATOS_VACIOS = { nombre: "", email: "", asunto: "", mensaje: "" };

const ETIQUETAS_CAMPO = {
  nombre: "Nombre y apellido",
  email: "Correo electrónico",
  asunto: "Asunto",
  mensaje: "Mensaje",
};

/* Mensajes copiados tal cual de Contacto-Escritorio.dc.html — ver
 * PLAN_FRONTEND.md ("no reinterpretar el diseño"). */
function validarNombre(valor) {
  if (!valor || !valor.trim()) return "Ingresá tu nombre y apellido.";
  return null;
}
function validarCorreo(valor) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "Ingresá tu correo electrónico.";
  if (!PATRON_EMAIL.test(limpio)) {
    return "El correo no es válido. Revisá que tenga el formato nombre@ejemplo.com.";
  }
  return null;
}
function validarAsunto(valor) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "Escribí un asunto.";
  if (limpio.length < 3) return "El asunto tiene que tener al menos 3 caracteres.";
  return null;
}
function validarMensaje(valor) {
  const limpio = (valor ?? "").trim();
  if (!limpio) return "Escribí tu mensaje.";
  if (limpio.length < 10) return "El mensaje tiene que tener al menos 10 caracteres.";
  if (limpio.length > 500) return "El mensaje no puede pasar de 500 caracteres.";
  return null;
}

/**
 * C8. El envío es puramente local: no hay servicio que llamar (no se manda
 * ni se guarda nada, a propósito), así que alcanza con un estado de
 * React — no hace falta un `contactoService` para esto.
 */
function Contacto() {
  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(null);

  function actualizarCampo(campo, valor) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));
  }

  function validar() {
    const nuevosErrores = {
      nombre: validarNombre(datos.nombre),
      email: validarCorreo(datos.email),
      asunto: validarAsunto(datos.asunto),
      mensaje: validarMensaje(datos.mensaje),
    };
    const soloConError = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([, mensaje]) => mensaje),
    );
    setErrores(soloConError);
    return Object.keys(soloConError).length === 0;
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    if (!validar()) return;
    setEnviado(datos.nombre.trim().split(/\s+/)[0]);
  }

  function reiniciar() {
    setDatos(DATOS_VACIOS);
    setErrores({});
    setEnviado(null);
  }

  const camposConError = Object.keys(errores);

  return (
    <div className="contenedor pagina-contacto">
      <Migas items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Contacto" }]} />

      <div className="pagina-contacto-encabezado">
        <h1>Contacto</h1>
      </div>
      <p className="pagina-contacto-subtitulo">
        Si tenés una consulta sobre Changuito, completá el formulario y contanos.
      </p>

      <div className="pagina-contacto-grilla">
        <section className="tarjeta-contacto">
          {enviado ? (
            <div className="contacto-exito">
              <span className="contacto-exito-icono" aria-hidden="true">
                <IconoConfirmar width={24} height={24} />
              </span>
              <h2>Consulta enviada (simulado)</h2>
              <p>
                Gracias, {enviado}. Esto es una demostración: tu consulta no se
                envió a nadie ni se guardó.
              </p>
              <div className="contacto-exito-acciones">
                <Boton variante="secundario" onClick={reiniciar}>
                  Enviar otra consulta
                </Boton>
                <Boton variante="principal" to="/">
                  Volver al inicio
                </Boton>
              </div>
            </div>
          ) : (
            <>
              <h2>Escribinos tu consulta</h2>
              <p className="pagina-contacto-leyenda">
                <span aria-hidden="true">*</span> Campo obligatorio
              </p>

              {camposConError.length > 0 && (
                <Recuadro
                  variante="error"
                  titulo={`No se pudo enviar. Hay ${camposConError.length} ${camposConError.length === 1 ? "campo" : "campos"} para revisar.`}
                >
                  <ul>
                    {camposConError.map((campo) => (
                      <li key={campo}>
                        {ETIQUETAS_CAMPO[campo]}: {errores[campo]}
                      </li>
                    ))}
                  </ul>
                </Recuadro>
              )}

              <form onSubmit={manejarSubmit} noValidate>
                <CampoFormulario
                  etiqueta="Nombre y apellido"
                  obligatorio
                  ayuda="Escribí tu nombre y tu apellido."
                  error={errores.nombre}
                  value={datos.nombre}
                  onChange={(e) => actualizarCampo("nombre", e.target.value)}
                />
                <CampoFormulario
                  etiqueta="Correo electrónico"
                  obligatorio
                  type="email"
                  ayuda="Usá el formato nombre@ejemplo.com. Es solo para esta demostración."
                  error={errores.email}
                  value={datos.email}
                  onChange={(e) => actualizarCampo("email", e.target.value)}
                />
                <CampoFormulario
                  etiqueta="Asunto"
                  obligatorio
                  ayuda="Resumí el motivo en pocas palabras."
                  error={errores.asunto}
                  value={datos.asunto}
                  onChange={(e) => actualizarCampo("asunto", e.target.value)}
                />
                <CampoFormulario
                  etiqueta="Mensaje"
                  obligatorio
                  como="textarea"
                  rows={5}
                  maxLength={500}
                  ayuda={
                    errores.mensaje
                      ? undefined
                      : `Contanos tu consulta con tus palabras. Entre 10 y 500 caracteres. (${datos.mensaje.length} / 500)`
                  }
                  error={errores.mensaje}
                  value={datos.mensaje}
                  onChange={(e) => actualizarCampo("mensaje", e.target.value)}
                />

                <div className="pagina-contacto-acciones">
                  <Boton type="submit" variante="principal">
                    <IconoCorreo width={18} height={18} /> Enviar consulta
                  </Boton>
                  <p className="pagina-contacto-disclaimer">
                    Envío simulado: no se manda ningún mensaje ni se guarda nada.
                  </p>
                </div>
              </form>
            </>
          )}
        </section>

        <aside className="tarjeta-otros-datos">
          <h2>Otros datos de contacto</h2>
          <dl>
            <div>
              <dt>Correo de contacto</dt>
              <dd>contacto@changuito.com.ar</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>011 2345-6789</dd>
            </div>
            <div>
              <dt>Dirección del local</dt>
              <dd>Av. Rivadavia 4850, Caballito, CABA</dd>
            </div>
            <div>
              <dt>Horario de atención</dt>
              <dd>Lunes a sábado, de 9 a 20 h</dd>
            </div>
            <div>
              <dt>Redes sociales</dt>
              <dd>Instagram: @changuito.almacen</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export default Contacto;
