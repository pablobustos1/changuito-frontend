import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import * as productosService from "../services/productosService";
import Migas from "../components/ui/Migas";
import Recuadro from "../components/ui/Recuadro";
import Boton from "../components/ui/Boton";
import CampoFormulario from "../components/ui/CampoFormulario";
import IndicadorPasos from "../components/compra/IndicadorPasos";
import ResumenPedido from "../components/compra/ResumenPedido";
import { IconoConfirmar } from "../components/ui/Iconos";
import { validarObligatorio } from "../utils/validaciones";
import "./FinalizarCompra.css";

function generarNumeroOperacion() {
  return `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * C5. "Tus datos" y "Medio de pago" no son formularios acá (ver
 * "Desviaciones del prototipo" en PLAN_FRONTEND.md): nombre/apellido/
 * correo salen de la sesión, y el medio de pago es fijo —"Transferencia",
 * la única que existe en el backend real— así que lo único que se valida
 * es la entrega. Las observaciones usan un tope duro (`maxLength`) en vez
 * de un error post-submit: es más simple y nunca deja al campo en un
 * estado inválido.
 */
function FinalizarCompra() {
  const { usuarioActual } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const [productosPorId, setProductosPorId] = useState({});
  const [cargando, setCargando] = useState(true);
  const [tipoEntrega, setTipoEntrega] = useState("domicilio");
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let vigente = true;
    if (items.length === 0) {
      setCargando(false);
      return undefined;
    }
    setCargando(true);
    Promise.all(
      items.map((item) => productosService.obtener(item.idProducto).catch(() => null)),
    ).then((resultados) => {
      if (!vigente) return;
      const mapa = {};
      resultados.forEach((producto, indice) => {
        if (producto) mapa[items[indice].idProducto] = producto;
      });
      setProductosPorId(mapa);
      setCargando(false);
    });
    return () => {
      vigente = false;
    };
  }, [items]);

  const lineas = useMemo(
    () =>
      items
        .map((item) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          producto: productosPorId[item.idProducto],
        }))
        .filter((linea) => linea.producto?.disponible)
        .map((linea) => ({
          idProducto: linea.idProducto,
          cantidad: linea.cantidad,
          nombre: linea.producto.nombre,
          precio: linea.producto.precio,
        })),
    [items, productosPorId],
  );

  const total = lineas.reduce((suma, l) => suma + l.cantidad * l.precio, 0);
  const hayNoDisponibles = !cargando && lineas.length < items.length;

  /* Si no queda nada para comprar (carrito vacío o todo no disponible),
   * esta pantalla no tiene sentido: se vuelve al carrito. */
  useEffect(() => {
    if (!cargando && lineas.length === 0) {
      navigate("/carrito", { replace: true });
    }
  }, [cargando, lineas.length, navigate]);

  function validar() {
    const nuevosErrores = {};
    if (tipoEntrega === "domicilio") {
      const error = validarObligatorio(
        direccion,
        "Ingresá la dirección de entrega. Puede ser ilustrativa.",
      );
      if (error) nuevosErrores.direccion = error;
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    const resumen = {
      lineas,
      total,
      tipoEntrega,
      direccion: tipoEntrega === "domicilio" ? direccion.trim() : "",
      observaciones: observaciones.trim(),
      numeroOperacion: generarNumeroOperacion(),
      nombreComprador: usuarioActual.nombre,
    };

    /* El carrito se vacía en CompraConfirmada, no acá: si se vaciara en
     * este mismo evento, el guard de arriba ("si no queda nada, volver al
     * carrito") puede llegar a dispararse antes de que termine de aplicarse
     * esta navegación y pisarla con un segundo `replace` hacia /carrito. */
    navigate("/compra-confirmada", { state: resumen, replace: true });
  }

  const migas = (
    <Migas
      items={[
        { etiqueta: "Inicio", to: "/" },
        { etiqueta: "Carrito", to: "/carrito" },
        { etiqueta: "Finalizar compra" },
      ]}
    />
  );

  if (cargando) {
    return (
      <div className="contenedor pagina-finalizar-compra">
        {migas}
        <p className="pagina-finalizar-compra-cargando">Cargando tu pedido…</p>
      </div>
    );
  }

  if (lineas.length === 0) {
    return null;
  }

  return (
    <div className="contenedor pagina-finalizar-compra">
      {migas}

      <div className="pagina-finalizar-compra-encabezado">
        <h1>Finalizar compra</h1>
        <span className="pagina-finalizar-compra-dato-ejemplo">
          Compra simulada · datos de ejemplo
        </span>
      </div>

      <IndicadorPasos pasoActivo={2} />

      <Recuadro variante="info" titulo="Esto es una simulación académica">
        No se procesa dinero real ni se guarda ningún pedido. Completá datos
        ilustrativos y no escribas números de tarjeta ni datos bancarios.
      </Recuadro>

      {hayNoDisponibles && (
        <Recuadro variante="info">
          Hay productos en tu carrito que ya no están disponibles. No se
          incluyen en este pedido.
        </Recuadro>
      )}

      <form onSubmit={manejarSubmit} noValidate>
        <div className="pagina-finalizar-compra-grilla">
          <div className="pagina-finalizar-compra-columna">
            <section className="tarjeta-finalizar-compra">
              <h2>Tus datos</h2>
              <p className="finalizar-compra-comprando-como">
                Comprando como{" "}
                <strong>
                  {usuarioActual.nombre} {usuarioActual.apellido}
                </strong>{" "}
                ({usuarioActual.email})
              </p>
            </section>

            <section className="tarjeta-finalizar-compra">
              <h2>Entrega</h2>
              <div className="opciones-entrega">
                <label
                  className={`opcion-entrega ${tipoEntrega === "domicilio" ? "opcion-entrega-activa" : ""}`}
                >
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="domicilio"
                    checked={tipoEntrega === "domicilio"}
                    onChange={() => {
                      setTipoEntrega("domicilio");
                      setErrores({});
                    }}
                  />
                  <span>
                    <strong>Entrega a domicilio</strong>
                    <small>Con dirección de entrega simulada.</small>
                  </span>
                </label>
                <label
                  className={`opcion-entrega ${tipoEntrega === "retiro" ? "opcion-entrega-activa" : ""}`}
                >
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="retiro"
                    checked={tipoEntrega === "retiro"}
                    onChange={() => {
                      setTipoEntrega("retiro");
                      setErrores({});
                    }}
                  />
                  <span>
                    <strong>Retiro en el local</strong>
                    <small>Sin dirección de entrega.</small>
                  </span>
                </label>
              </div>

              {tipoEntrega === "domicilio" && (
                <CampoFormulario
                  etiqueta="Dirección de entrega simulada"
                  obligatorio
                  placeholder="Calle y número de ejemplo"
                  ayuda="Puede ser una dirección ilustrativa. No se usa para ningún envío."
                  error={errores.direccion}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              )}

              <CampoFormulario
                etiqueta="Observaciones (opcional)"
                como="textarea"
                rows={3}
                maxLength={200}
                placeholder="Por ejemplo: un aviso para quien recibe."
                ayuda={`${observaciones.length} / 200`}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </section>

            <section className="tarjeta-finalizar-compra">
              <h2>Medio de pago</h2>
              <div className="medio-pago-fijo">
                <strong>Transferencia (simulado)</strong>
                <p>Simulado: no se muestran datos bancarios.</p>
              </div>
            </section>
          </div>

          <ResumenPedido lineas={lineas} total={total} conEditar />
        </div>

        <div className="pagina-finalizar-compra-acciones">
          <Boton type="submit" variante="principal" disabled={enviando}>
            <IconoConfirmar width={18} height={18} />{" "}
            {enviando ? "Confirmando…" : "Confirmar compra simulada"}
          </Boton>
          <Boton variante="secundario" to="/carrito">
            Volver al carrito
          </Boton>
        </div>
        <p className="pagina-finalizar-compra-disclaimer">
          Al confirmar no se cobra nada ni se guarda un pedido: solo se
          muestra la pantalla de confirmación.
        </p>
      </form>
    </div>
  );
}

export default FinalizarCompra;
