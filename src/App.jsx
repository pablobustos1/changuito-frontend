import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import LayoutCliente from "./components/layout/LayoutCliente";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import RutaProtegida from "./components/layout/RutaProtegida";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import FinalizarCompra from "./pages/FinalizarCompra";
import CompraConfirmada from "./pages/CompraConfirmada";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import IniciarSesion from "./pages/IniciarSesion";
import Registrarse from "./pages/Registrarse";
import PoliticaDePrivacidad from "./pages/PoliticaDePrivacidad";
import ListadoProductos from "./pages/admin/ListadoProductos";
import DetalleProductoAdmin from "./pages/admin/DetalleProductoAdmin";
import ModificarProducto from "./pages/admin/ModificarProducto";
import NuevoProducto from "./pages/admin/NuevoProducto";

/**
 * Árbol de rutas completo (paso 2). C1-C8 y L1-L3 bajo LayoutCliente, A1-A5
 * bajo LayoutAdmin — protegido una sola vez a la altura del layout, no en
 * cada página admin por separado. /finalizar-compra pide sesión de
 * cualquier rol; /administracion pide sesión de Administrador.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<LayoutCliente />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Catalogo />} />
              <Route path="/productos/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route
                path="/finalizar-compra"
                element={
                  <RutaProtegida>
                    <FinalizarCompra />
                  </RutaProtegida>
                }
              />
              <Route path="/compra-confirmada" element={<CompraConfirmada />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/iniciar-sesion" element={<IniciarSesion />} />
              <Route path="/registrarse" element={<Registrarse />} />
              <Route
                path="/politica-de-privacidad"
                element={<PoliticaDePrivacidad />}
              />
            </Route>

            <Route
              path="/administracion"
              element={
                <RutaProtegida rolRequerido="Administrador">
                  <LayoutAdmin />
                </RutaProtegida>
              }
            >
              <Route index element={<ListadoProductos />} />
              <Route path="productos/nuevo" element={<NuevoProducto />} />
              <Route path="productos/:id" element={<DetalleProductoAdmin />} />
              <Route path="productos/:id/editar" element={<ModificarProducto />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
