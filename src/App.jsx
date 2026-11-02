import { BrowserRouter } from "react-router-dom";
import Boton from "./components/ui/Boton";
import CampoFormulario from "./components/ui/CampoFormulario";
import Etiqueta from "./components/ui/Etiqueta";
import {
  IconoCarrito,
  IconoBuscar,
  IconoModificar,
  IconoEliminar,
  IconoConfirmar,
  IconoCorreo,
  IconoAlmacen,
  IconoAviso,
} from "./components/ui/Iconos";

/**
 * Vista de control del sistema de diseño — PROVISORIA. Se reemplaza en el
 * paso 2 por el enrutamiento real de la app. Sirve para verificar a simple
 * vista que los tokens, los botones, las etiquetas y los íconos están bien
 * antes de construir una sola pantalla real sobre ellos.
 */
function App() {
  return (
    <BrowserRouter>
      <main
        className="contenedor"
        style={{
          paddingTop: 32,
          paddingBottom: 48,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <h1>Changuito</h1>
        <p style={{ color: "var(--color-texto-suave)" }}>
          Sistema de diseño — paso 1 del plan.
        </p>

        <section style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Boton variante="principal">Finalizar compra</Boton>
          <Boton variante="acento">Agregar al carrito</Boton>
          <Boton variante="secundario">Seguir comprando</Boton>
          <Boton variante="destructivo">Eliminar producto</Boton>
          <Boton variante="enlace">Volver al listado</Boton>
        </section>

        <section style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Etiqueta variante="disponible" />
          <Etiqueta variante="sin-stock" />
          <Etiqueta variante="oferta" />
          <Etiqueta variante="guardado" />
          <Etiqueta variante="desactivado" />
        </section>

        <section
          style={{
            display: "flex",
            gap: 24,
            color: "var(--color-verde-principal)",
          }}
        >
          <IconoCarrito />
          <IconoBuscar />
          <IconoModificar />
          <IconoEliminar />
          <IconoConfirmar />
          <IconoCorreo />
          <IconoAlmacen />
          <IconoAviso />
        </section>

        <section style={{ maxWidth: 360 }}>
          <CampoFormulario
            etiqueta="Correo electrónico"
            obligatorio
            type="email"
            placeholder="nombre@dominio.com"
            ayuda="Ingresá un correo válido, por ejemplo nombre@dominio.com."
          />
          <CampoFormulario
            etiqueta="Nombre y apellido"
            obligatorio
            error="Ingresá tu nombre y apellido."
          />
        </section>
      </main>
    </BrowserRouter>
  );
}

export default App;
