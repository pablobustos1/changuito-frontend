import { Outlet } from "react-router-dom";
import NavbarCliente from "./NavbarCliente";
import Footer from "./Footer";

/** Envoltorio de todas las pantallas del comprador: navbar clara + pie de página. */
function LayoutCliente() {
  return (
    <>
      <NavbarCliente />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default LayoutCliente;
