import senalando from "../../assets/marca/senalando.png";
import Boton from "./Boton";
import "./EstadoVacio.css";

/**
 * Carrito vacío, búsqueda sin resultados, sin productos en una categoría:
 * las tres comparten exactamente esta forma — personaje señalando, título,
 * texto y un único botón de salida (Catalogo-Estados.dc.html,
 * Compra-Estados.dc.html).
 */
function EstadoVacio({
  titulo,
  children,
  etiquetaBoton,
  to,
  onClick,
  varianteBoton = "principal",
}) {
  return (
    <div className="estado-vacio">
      <img src={senalando} alt="" width="140" height="140" />
      <h2>{titulo}</h2>
      <p>{children}</p>
      <Boton variante={varianteBoton} to={to} onClick={onClick}>
        {etiquetaBoton}
      </Boton>
    </div>
  );
}

export default EstadoVacio;
