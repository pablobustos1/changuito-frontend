import { useId } from "react";
import { IconoAviso } from "./Iconos";
import "./CampoFormulario.css";

/**
 * Campo de formulario con etiqueta, ayuda opcional y mensaje de error. El
 * error siempre va acompañado de texto e ícono, nunca solo con color
 * (Identidad-Componentes.dc.html), y queda asociado al campo por
 * aria-describedby + aria-invalid para que un lector de pantalla lo anuncie.
 *
 * `como` elige el elemento: 'input' (default), 'select' o 'textarea'. El
 * resto de las props (value, onChange, type, children con las <option> de un
 * select, etc.) se pasan directo a ese elemento.
 */
function CampoFormulario({
  etiqueta,
  ayuda,
  error,
  como = "input",
  obligatorio = false,
  className = "",
  children,
  ...resto
}) {
  const id = useId();
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const Elemento = como;

  return (
    <div
      className={`campo-formulario ${error ? "campo-formulario-con-error" : ""} ${className}`.trim()}
    >
      <label htmlFor={id}>
        {etiqueta}
        {obligatorio && <span aria-hidden="true"> *</span>}
      </label>

      <Elemento
        id={id}
        aria-describedby={[idAyuda, idError].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? "true" : undefined}
        {...resto}
      >
        {children}
      </Elemento>

      {ayuda && !error && (
        <p id={idAyuda} className="campo-formulario-ayuda">
          {ayuda}
        </p>
      )}

      {error && (
        <p id={idError} className="campo-formulario-error" role="alert">
          <IconoAviso width={16} height={16} />
          {error}
        </p>
      )}
    </div>
  );
}

export default CampoFormulario;
