import { useState } from "react";
import Boton from "../ui/Boton";
import CampoFormulario from "../ui/CampoFormulario";
import Recuadro from "../ui/Recuadro";
import Etiqueta from "../ui/Etiqueta";
import SelectorCategoria from "./SelectorCategoria";
import {
  validarNombreProducto,
  validarCategoriaProducto,
  validarPrecioProducto,
  validarDescripcionProducto,
  validarStockInicial,
  parsearPrecio,
} from "../../utils/validacionesProducto";
import "./FormularioProducto.css";

const ETIQUETAS_CAMPO = {
  nombre: "Nombre",
  idCategoria: "Categoría",
  precio: "Precio",
  detalle: "Descripción",
  stock: "Stock",
};

function formatearPrecioParaTexto(precio) {
  if (precio === undefined || precio === null) return "";
  return String(precio).replace(".", ",");
}

/**
 * Formulario de Nuevo (A5) y Modificar (A3) producto — comparten
 * exactamente las mismas reglas de validación (Admin-Estados.dc.html), así
 * que es un solo componente parametrizado por `modo`.
 *
 * La diferencia real entre los dos está en el stock: en "crear" es un campo
 * editable y obligatorio (el backend real lo pide en el alta); en "editar"
 * es de solo lectura (el backend real lo ignora en la modificación) — ver
 * PLAN_FRONTEND.md, deviación del paso 7.
 */
function FormularioProducto({
  modo,
  valoresIniciales,
  onGuardar,
  onCancelar,
  textoBoton,
}) {
  const [nombre, setNombre] = useState(valoresIniciales?.nombre ?? "");
  const [idCategoria, setIdCategoria] = useState(valoresIniciales?.idCategoria ?? null);
  const [precioTexto, setPrecioTexto] = useState(
    formatearPrecioParaTexto(valoresIniciales?.precio),
  );
  const [detalle, setDetalle] = useState(valoresIniciales?.detalle ?? "");
  const [stockTexto, setStockTexto] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const nuevosErrores = {
      nombre: validarNombreProducto(nombre),
      idCategoria: validarCategoriaProducto(idCategoria),
      precio: validarPrecioProducto(precioTexto),
      detalle: validarDescripcionProducto(detalle),
    };
    if (modo === "crear") {
      nuevosErrores.stock = validarStockInicial(stockTexto);
    }
    const soloConError = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([, mensaje]) => mensaje),
    );
    setErrores(soloConError);
    return Object.keys(soloConError).length === 0;
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    const datos = {
      nombre: nombre.trim(),
      detalle: detalle.trim(),
      precio: parsearPrecio(precioTexto),
      idCategoria,
    };
    if (modo === "crear") {
      datos.stockActual = Number(stockTexto.trim());
    }

    setEnviando(true);
    try {
      await onGuardar(datos);
    } catch (error) {
      setErrorGeneral(error.message);
      setEnviando(false);
    }
  }

  const camposConError = Object.keys(errores);

  return (
    <form onSubmit={manejarSubmit} noValidate className="formulario-producto">
      {errorGeneral && <Recuadro variante="error">{errorGeneral}</Recuadro>}

      {camposConError.length > 0 && (
        <Recuadro
          variante="error"
          titulo={`No se pudo guardar. Hay ${camposConError.length} ${camposConError.length === 1 ? "campo" : "campos"} para revisar.`}
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

      <div className="formulario-producto-grilla">
        <div className="formulario-producto-campos">
          <CampoFormulario
            etiqueta="Nombre"
            obligatorio
            error={errores.nombre}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <SelectorCategoria
            valor={idCategoria}
            onCambiar={setIdCategoria}
            error={errores.idCategoria}
          />

          <CampoFormulario
            etiqueta="Precio en pesos"
            obligatorio
            inputMode="decimal"
            placeholder="2350"
            ayuda="Solo números. Para centavos usá coma, por ejemplo 2350,50."
            error={errores.precio}
            value={precioTexto}
            onChange={(e) => setPrecioTexto(e.target.value)}
          />

          <CampoFormulario
            etiqueta="Descripción"
            obligatorio
            como="textarea"
            rows={4}
            maxLength={200}
            ayuda={`Entre 10 y 200 caracteres. (${detalle.length} / 200)`}
            error={errores.detalle}
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />

          <div className="formulario-producto-acciones">
            <Boton type="submit" variante="principal" disabled={enviando}>
              {enviando ? "Guardando…" : textoBoton}
            </Boton>
            <Boton variante="secundario" type="button" onClick={onCancelar}>
              Cancelar
            </Boton>
          </div>
        </div>

        <div className="formulario-producto-lateral">
          {modo === "crear" ? (
            <CampoFormulario
              etiqueta="Stock inicial"
              obligatorio
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              ayuda="Cantidad de unidades con la que arranca el producto."
              error={errores.stock}
              value={stockTexto}
              onChange={(e) => setStockTexto(e.target.value)}
            />
          ) : (
            <div className="formulario-producto-stock-fijo">
              <h2>Stock</h2>
              <div className="formulario-producto-stock-valor">
                <strong>{valoresIniciales.stockActual}</strong>
                <span>{valoresIniciales.stockActual === 1 ? "unidad" : "unidades"}</span>
                <Etiqueta variante="sin-stock">Solo lectura</Etiqueta>
              </div>
              <p>
                El stock no se edita acá: en el backend real cambia con las
                operaciones del negocio (compras a proveedores, confirmación
                de pedidos), nunca a mano.
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default FormularioProducto;
