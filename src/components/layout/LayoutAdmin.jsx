import { Outlet } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";

/**
 * Envoltorio de las pantallas de administración: navbar oscura, sin pie de
 * página (el pie es "solo del lado del comprador", Mapa-de-pantallas.dc.html).
 */
function LayoutAdmin() {
  return (
    <>
      <NavbarAdmin />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutAdmin;
