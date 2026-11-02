import { CATEGORIAS } from "../../data/categorias";
import { IconoAviso } from "../ui/Iconos";
import "./SelectorCategoria.css";

/**
 * Selector de categoría de Nuevo/Modificar producto (Admin-Estados.dc.html):
 * pills de selección única, no un `<select>`. Mismo patrón visual que
 * `FiltroCategoria` del catálogo, pero controlado por valor/onChange en vez
 * de la URL — acá es un campo de formulario, no un filtro.
 */
function SelectorCategoria({ valor, onCambiar, error }) {
  const idError = error ? "selector-categoria-error" : undefined;

  return (
    <div className="campo-formulario campo-selector-categoria">
      <span id="selector-categoria-etiqueta">
        Categoría<span aria-hidden="true"> *</span>
      </span>
      <div
        className="selector-categoria"
        role="radiogroup"
        aria-labelledby="selector-categoria-etiqueta"
        aria-describedby={idError}
      >
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria.idCategoria}
            type="button"
            role="radio"
            aria-checked={valor === categoria.idCategoria}
            className={`selector-categoria-pill ${valor === categoria.idCategoria ? "selector-categoria-pill-activa" : ""}`}
            onClick={() => onCambiar(categoria.idCategoria)}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
      {error && (
        <p id={idError} className="campo-formulario-error" role="alert">
          <IconoAviso width={16} height={16} />
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectorCategoria;
