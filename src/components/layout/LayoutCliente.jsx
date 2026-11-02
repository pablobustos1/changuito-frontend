import { Outlet } from "react-router-dom";
import NavbarCliente from "./NavbarCliente";
import Footer from "./Footer";
import ToastCarrito from "../carrito/ToastCarrito";

/** Envoltorio de todas las pantallas del comprador: navbar clara + pie de página. */
function LayoutCliente() {
  return (
    <>
      <NavbarCliente />
      <ToastCarrito />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default LayoutCliente;
