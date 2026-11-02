import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Boton from "../components/ui/Boton";
import IndicadorPasos from "../components/compra/IndicadorPasos";
import ResumenPedido from "../components/compra/ResumenPedido";
import { IconoConfirmar } from "../components/ui/Iconos";
import festejo from "../assets/marca/festejo.png";
import "./CompraConfirmada.css";

/**
 * C6. No existe sin haber pasado por Finalizar compra: el pedido no se
 * guarda en ningún lado (es una simulación), así que todo lo que se
 * muestra acá viaja en `location.state`, puesto una sola vez al confirmar.
 * Entrar directo a esta URL (o refrescar la página) no tiene nada que
 * mostrar — se manda a Inicio, igual que si el "pedido" nunca hubiera
 * existido.
 *
 * El carrito se vacía acá (no en Finalizar compra) para que la navegación
 * hacia esta pantalla ya haya terminado antes de que cambie `items`: así
 * el guard de "carrito vacío → volver a /carrito" de Finalizar compra no
 * llega a dispararse y pisar esta navegación.
 */
function CompraConfirmada() {
  const { state } = useLocation();
  const { vaciar } = useCart();

  /* Solo depende de `state`, a propósito: `vaciar` cambia de identidad en
   * cada render de CartProvider (incluido el que dispara vaciar() mismo),
   * así que incluirla en las dependencias dispararía el efecto sin fin. */
  useEffect(() => {
    if (state) vaciar();
  }, [state]);

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { lineas, total, numeroOperacion, nombreComprador, tipoEntrega, direccion, observaciones } =
    state;

  return (
    <div className="contenedor pagina-compra-confirmada">
      <IndicadorPasos pasoActivo={3} />

      <section className="compra-confirmada-banda">
        <img src={festejo} alt="" width="110" height="116" />
        <div className="compra-confirmada-texto">
          <span className="compra-confirmada-etiqueta">
            <IconoConfirmar width={16} height={16} /> Compra simulada confirmada
          </span>
          <h1>¡Listo, {nombreComprador}! Tu compra simulada quedó confirmada.</h1>
          <p>
            Esto es una demostración: no se procesó ningún pago, no se guardó
            el pedido y no se envió ningún correo.
          </p>
        </div>
        <div className="compra-confirmada-operacion">
          <span>Número de operación demostrativa</span>
          <strong>{numeroOperacion}</strong>
          <small>Número ficticio: no corresponde a un pedido real.</small>
        </div>
      </section>

      <div className="pagina-compra-confirmada-grilla">
        <div className="compra-confirmada-datos">
          <h2>Datos de la entrega</h2>
          <p>
            <strong>Forma de entrega:</strong>{" "}
            {tipoEntrega === "domicilio" ? "Entrega a domicilio" : "Retiro en el local"}
          </p>
          {tipoEntrega === "domicilio" && (
            <p>
              <strong>Dirección:</strong> {direccion}
            </p>
          )}
          {observaciones && (
            <p>
              <strong>Observaciones:</strong> {observaciones}
            </p>
          )}
          <p>
            <strong>Medio de pago:</strong> Transferencia (simulado)
          </p>
        </div>

        <ResumenPedido lineas={lineas} total={total} />
      </div>

      <div className="pagina-compra-confirmada-acciones">
        <Boton variante="principal" to="/">
          Volver al inicio
        </Boton>
        <Boton variante="secundario" to="/productos">
          Seguir comprando
        </Boton>
      </div>
    </div>
  );
}

export default CompraConfirmada;
