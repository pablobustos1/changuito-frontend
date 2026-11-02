import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Boton from "../components/ui/Boton";
import CampoFormulario from "../components/ui/CampoFormulario";
import Migas from "../components/ui/Migas";
import Recuadro from "../components/ui/Recuadro";
import { IconoAviso } from "../components/ui/Iconos";
import {
  validarTexto,
  validarEmail,
  validarTelefono,
  validarContrasena,
  sinVacios,
} from "../utils/validaciones";
import "./AuthFormulario.css";

const ETIQUETAS_CAMPO = {
  nombre: "Nombre",
  apellido: "Apellido",
  email: "Email",
  telefono: "Teléfono",
  contrasena: "Contraseña",
  aceptaPolitica: "Política de privacidad",
};

/**
 * L2. El registro público siempre crea un Cliente — no hay, y no debe
 * haber nunca, un campo para elegir rol acá (ver PLAN_FRONTEND.md). Las
 * reglas de validación son las mismas que UsuarioRegistroRequest del
 * backend real.
 */
function Registrarse() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasena: "",
  });
  const [aceptaPolitica, setAceptaPolitica] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function actualizarCampo(campo, valor) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));
  }

  function validar() {
    const nuevosErrores = sinVacios({
      nombre: validarTexto(datos.nombre, { campo: "nombre", max: 100 }),
      apellido: validarTexto(datos.apellido, { campo: "apellido", max: 100 }),
      email: validarEmail(datos.email, { max: 150 }),
      telefono: validarTelefono(datos.telefono),
      contrasena: validarContrasena(datos.contrasena),
      aceptaPolitica: aceptaPolitica
        ? null
        : "Tenés que aceptar la Política de Privacidad para registrarte.",
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    setEnviando(true);
    try {
      await registrar(datos);
      navigate(ubicacion.state?.desde?.pathname ?? "/", { replace: true });
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setEnviando(false);
    }
  }

  const camposConError = Object.keys(errores);

  return (
    <div className="contenedor">
      <Migas items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Registrarse" }]} />

      <div className="pagina-auth">
        <div className="tarjeta-auth">
          <h1>Registrarse</h1>
          <p className="pagina-auth-subtitulo">
            Creá tu cuenta de Changuito. Es rápido y es solo para esta
            demostración.
          </p>

          {errorGeneral && <Recuadro variante="error">{errorGeneral}</Recuadro>}

          {camposConError.length > 0 && (
            <Recuadro
              variante="error"
              titulo={`No se pudo registrar. Hay ${camposConError.length} ${camposConError.length === 1 ? "campo" : "campos"} para revisar.`}
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
            <p className="pagina-auth-leyenda">
              <span aria-hidden="true">*</span> Campo obligatorio
            </p>

            <CampoFormulario
              etiqueta="Nombre"
              obligatorio
              value={datos.nombre}
              onChange={(e) => actualizarCampo("nombre", e.target.value)}
              error={errores.nombre}
            />
            <CampoFormulario
              etiqueta="Apellido"
              obligatorio
              value={datos.apellido}
              onChange={(e) => actualizarCampo("apellido", e.target.value)}
              error={errores.apellido}
            />
            <CampoFormulario
              etiqueta="Email"
              obligatorio
              type="email"
              autoComplete="email"
              value={datos.email}
              onChange={(e) => actualizarCampo("email", e.target.value)}
              error={errores.email}
            />
            <CampoFormulario
              etiqueta="Teléfono"
              obligatorio
              type="tel"
              inputMode="numeric"
              placeholder="1123456789"
              ayuda="10 dígitos, solo números, sin espacios ni guiones."
              value={datos.telefono}
              onChange={(e) => actualizarCampo("telefono", e.target.value)}
              error={errores.telefono}
            />
            <CampoFormulario
              etiqueta="Contraseña"
              obligatorio
              type="password"
              autoComplete="new-password"
              ayuda="Entre 6 y 100 caracteres."
              value={datos.contrasena}
              onChange={(e) => actualizarCampo("contrasena", e.target.value)}
              error={errores.contrasena}
            />

            <div
              className={`campo-checkbox ${errores.aceptaPolitica ? "campo-formulario-con-error" : ""}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={aceptaPolitica}
                  onChange={(e) => setAceptaPolitica(e.target.checked)}
                  aria-describedby={
                    errores.aceptaPolitica ? "error-acepta-politica" : undefined
                  }
                />
                <span>
                  Leí y acepto la{" "}
                  <Link to="/politica-de-privacidad" target="_blank" rel="noopener">
                    Política de Privacidad
                  </Link>
                  .
                </span>
              </label>
              {errores.aceptaPolitica && (
                <p
                  id="error-acepta-politica"
                  className="campo-formulario-error"
                  role="alert"
                >
                  <IconoAviso width={16} height={16} />
                  {errores.aceptaPolitica}
                </p>
              )}
            </div>

            <Boton
              type="submit"
              variante="principal"
              disabled={enviando}
              className="pagina-auth-boton"
            >
              {enviando ? "Creando cuenta…" : "Crear cuenta"}
            </Boton>
          </form>

          <p className="pagina-auth-pie">
            ¿Ya tenés cuenta? <Link to="/iniciar-sesion">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registrarse;
