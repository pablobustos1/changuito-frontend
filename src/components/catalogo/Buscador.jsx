import { IconoBuscar } from "../ui/Iconos";
import "./Buscador.css";

function Buscador({ valor, onCambiar }) {
  return (
    <div className="buscador">
      <IconoBuscar className="buscador-icono" />
      <input
        type="search"
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        placeholder="Por ejemplo: yerba, aceite, fideos"
        aria-label="Buscar productos por nombre"
      />
    </div>
  );
}

export default Buscador;
