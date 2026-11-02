import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as productosService from "../../services/productosService";
import Migas from "../../components/ui/Migas";
import Recuadro from "../../components/ui/Recuadro";
import FormularioProducto from "../../components/admin/FormularioProducto";
import "./FormularioProductoPagina.css";

/** A3. Formulario con los datos actuales — mismas validaciones que Nuevo. */
function ModificarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    let vigente = true;
    productosService
      .obtener(Number(id))
      .then((datos) => {
        if (vigente) setProducto(datos);
      })
      .catch(() => {
        if (vigente) setNoEncontrado(true);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [id]);

  async function manejarGuardar(datos) {
    const actualizado = await productosService.actualizar(producto.idProducto, datos);
    navigate("/administracion", {
      replace: true,
      state: {
        accion: "guardado",
        nombre: actualizado.nombre,
        idProducto: actualizado.idProducto,
      },
    });
  }

  const migas = (
    <Migas
      items={[
        { etiqueta: "Administración", to: "/administracion" },
        { etiqueta: "Productos", to: "/administracion" },
        { etiqueta: "Modificar producto" },
      ]}
    />
  );

  if (cargando) {
    return (
      <div className="contenedor pagina-admin-formulario">
        {migas}
        <p className="pagina-admin-formulario-cargando">Cargando producto…</p>
      </div>
    );
  }

  if (noEncontrado || !producto) {
    return (
      <div className="contenedor pagina-admin-formulario">
        {migas}
        <Recuadro variante="error" titulo="No encontramos este producto">
          Puede que el enlace esté roto o que el producto no exista. Volvé al{" "}
          <a href="/administracion">listado de productos</a>.
        </Recuadro>
      </div>
    );
  }

  return (
    <div className="contenedor pagina-admin-formulario">
      {migas}
      <h1>Modificar producto</h1>
      <p>Editá los datos de «{producto.nombre}».</p>

      <FormularioProducto
        modo="editar"
        valoresIniciales={producto}
        onGuardar={manejarGuardar}
        onCancelar={() => navigate("/administracion")}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}

export default ModificarProducto;
