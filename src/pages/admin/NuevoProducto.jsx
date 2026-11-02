import { useNavigate } from "react-router-dom";
import * as productosService from "../../services/productosService";
import Migas from "../../components/ui/Migas";
import FormularioProducto from "../../components/admin/FormularioProducto";
import "./FormularioProductoPagina.css";

/** A5. Formulario vacío, mismas validaciones que Modificar. */
function NuevoProducto() {
  const navigate = useNavigate();

  async function manejarGuardar(datos) {
    const creado = await productosService.crear(datos);
    navigate("/administracion", {
      replace: true,
      state: { accion: "agregado", nombre: creado.nombre, idProducto: creado.idProducto },
    });
  }

  return (
    <div className="contenedor pagina-admin-formulario">
      <Migas
        items={[
          { etiqueta: "Administración", to: "/administracion" },
          { etiqueta: "Productos", to: "/administracion" },
          { etiqueta: "Nuevo producto" },
        ]}
      />
      <h1>Agregar producto</h1>
      <p>Completá los datos del nuevo producto del catálogo.</p>

      <FormularioProducto
        modo="crear"
        onGuardar={manejarGuardar}
        onCancelar={() => navigate("/administracion")}
        textoBoton="Agregar producto"
      />
    </div>
  );
}

export default NuevoProducto;
