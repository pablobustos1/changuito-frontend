import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Boton from "../components/ui/Boton";
import CampoFormulario from "../components/ui/CampoFormulario";
import Migas from "../components/ui/Migas";
import Recuadro from "../components/ui/Recuadro";
import { validarEmail, validarObligatorio, sinVacios } from "../utils/validaciones";
import "./AuthFormulario.css";

/**
 * L1. Una sola pantalla de login para los dos roles — el destino después de
 * loguearse se decide solo, según el rol que devuelva la sesión: ver
 * PLAN_FRONTEND.md, "Autenticación".
 */
function IniciarSesion() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const nuevosErrores = sinVacios({
      email: validarEmail(email),
      contrasena: validarObligatorio(contrasena, "La contraseña es obligatoria"),
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
      const usuario = await iniciarSesion(email, contrasena);
      const destino =
        usuario.rol === "Administrador"
          ? "/administracion"
          : (ubicacion.state?.desde?.pathname ?? "/");
      navigate(destino, { replace: true });
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor">
      <Migas items={[{ etiqueta: "Inicio", to: "/" }, { etiqueta: "Iniciar sesión" }]} />

      <div className="pagina-auth">
        <div className="tarjeta-auth">
          <h1>Iniciar sesión</h1>
          <p className="pagina-auth-subtitulo">Entrá con tu cuenta de Changuito.</p>

          {errorGeneral && <Recuadro variante="error">{errorGeneral}</Recuadro>}

          <form onSubmit={manejarSubmit} noValidate>
            <CampoFormulario
              etiqueta="Email"
              obligatorio
              type="email"
              autoComplete="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              error={errores.email}
            />
            <CampoFormulario
              etiqueta="Contraseña"
              obligatorio
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              error={errores.contrasena}
            />

            <Boton
              type="submit"
              variante="principal"
              disabled={enviando}
              className="pagina-auth-boton"
            >
              {enviando ? "Ingresando…" : "Iniciar sesión"}
            </Boton>
          </form>

          <p className="pagina-auth-pie">
            ¿No tenés cuenta todavía?{" "}
            <Link to="/registrarse" state={ubicacion.state}>
              Registrate
            </Link>
          </p>

          <Recuadro variante="info" titulo="Cuentas de prueba">
            Administrador: <strong>adminchanguito@gmail.com / 123456</strong>{" "}
            · Cliente: <strong>chenzito@gmail.com / 123456</strong>.
          </Recuadro>
        </div>
      </div>
    </div>
  );
}

export default IniciarSesion;
