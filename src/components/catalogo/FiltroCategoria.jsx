import "./FiltroCategoria.css";

/**
 * Pills de categoría con contador (Catalogo-Escritorio.dc.html: "Todos 13",
 * "Almacén 6"...). `categoriaActiva` es el idCategoria o null para "Todos".
 */
function FiltroCategoria({ categorias, categoriaActiva, onCambiar, conteos, total }) {
  return (
    <div className="filtro-categoria" role="group" aria-label="Filtrar por categoría">
      <button
        type="button"
        className={`filtro-categoria-pill ${categoriaActiva === null ? "filtro-categoria-activo" : ""}`}
        onClick={() => onCambiar(null)}
        aria-pressed={categoriaActiva === null}
      >
        Todos <span>{total}</span>
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria.idCategoria}
          type="button"
          className={`filtro-categoria-pill ${categoriaActiva === categoria.idCategoria ? "filtro-categoria-activo" : ""}`}
          onClick={() => onCambiar(categoria.idCategoria)}
          aria-pressed={categoriaActiva === categoria.idCategoria}
        >
          {categoria.nombre} <span>{conteos[categoria.idCategoria] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

export default FiltroCategoria;
