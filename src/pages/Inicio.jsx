import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as productosService from "../services/productosService";
import { CATEGORIAS } from "../data/categorias";
import Boton from "../components/ui/Boton";
import TarjetaProducto from "../components/catalogo/TarjetaProducto";
import { IconoAlmacen, IconoCarrito, IconoBuscar, IconoConfirmar } from "../components/ui/Iconos";
import festejo from "../assets/marca/festejo.png";
import senalando from "../assets/marca/senalando.png";
import gondolaAlmacen from "../assets/marca/gondola-almacen.jpg";
import "./Inicio.css";

/* Uno de cada rubro, para que los destacados muestren variedad de categorías
 * y precios — no es una selección "inteligente", es fija a propósito. */
const IDS_DESTACADOS = [1, 7, 12, 19];

const CARACTERISTICAS = [
  {
    Icono: IconoCarrito,
    titulo: "Compra fácil",
    texto: "Encontrás lo que necesitás y lo sumás al carrito en pocos toques.",
  },
  {
    Icono: IconoAlmacen,
    titulo: "Productos de todos los días",
    texto: "Almacén, bebidas, limpieza y panadería, en un mismo lugar.",
  },
  {
    Icono: IconoBuscar,
    titulo: "Búsqueda clara",
    texto: "Filtrá por rubro, buscá por nombre u ordená por precio.",
  },
  {
    Icono: IconoConfirmar,
    titulo: "Proceso simple",
    texto: "Elegís, revisás el carrito y finalizás la compra en pocos pasos.",
  },
];

/** C1. Portada: hero, categorías, destacados, y la entrada a Nosotros. */
function Inicio() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    let vigente = true;
    productosService.listarDisponibles().then((productos) => {
      if (!vigente) return;
      const porId = Object.fromEntries(productos.map((p) => [p.idProducto, p]));
      setDestacados(IDS_DESTACADOS.map((id) => porId[id]).filter(Boolean));
    });
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <div className="pagina-inicio">
      <section className="inicio-hero">
        <div className="contenedor inicio-hero-grilla">
          <div className="inicio-hero-texto">
            <span className="inicio-pill inicio-pill-oscuro">
              Almacén de barrio · Compra online
            </span>
            <h1>Tu almacén de siempre, ahora a un clic.</h1>
            <p>
              Con Changuito encontrás los productos de todos los días, mirás los
              precios y armás tu pedido para comprar desde casa.
            </p>
            <div className="inicio-hero-botones">
              <Boton variante="acento" to="/productos">
                Explorar productos →
              </Boton>
              <Boton variante="secundario" to="/nosotros" className="inicio-hero-boton-claro">
                Conocer Changuito
              </Boton>
            </div>
          </div>

          <div className="inicio-hero-imagen">
            <div className="inicio-hero-foto">
              <img src={gondolaAlmacen} alt="Góndola de almacén con productos variados" />
            </div>
            <img src={festejo} alt="" className="inicio-hero-mascota" width="130" height="137" />
          </div>
        </div>
      </section>

      <section className="contenedor inicio-seccion">
        <div className="inicio-encabezado-seccion">
          <div>
            <span className="inicio-eyebrow">Categorías</span>
            <h2>Recorré el almacén por rubro</h2>
          </div>
        </div>

        <div className="inicio-categorias">
          {CATEGORIAS.map((categoria) => (
            <Link
              key={categoria.idCategoria}
              to={`/productos?categoria=${categoria.idCategoria}`}
              className="inicio-categoria-tarjeta"
            >
              <span className="inicio-categoria-icono">
                <IconoAlmacen width={24} height={24} />
              </span>
              <span className="inicio-categoria-nombre">{categoria.nombre}</span>
              <span className="inicio-categoria-link">Ver productos →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="contenedor inicio-seccion">
        <div className="inicio-encabezado-seccion">
          <div>
            <span className="inicio-eyebrow">Destacados</span>
            <h2>Productos destacados</h2>
          </div>
          <div className="inicio-destacados-acciones">
            <Link to="/productos" className="inicio-ver-todos">
              Ver todos los productos →
            </Link>
          </div>
        </div>

        <div className="inicio-destacados-grilla">
          {destacados.map((producto) => (
            <TarjetaProducto key={producto.idProducto} producto={producto} />
          ))}
        </div>
      </section>

      <section className="inicio-franja">
        <div className="contenedor">
          <span className="inicio-eyebrow">Por qué Changuito</span>
          <h2>Comprar en tu almacén, sin vueltas</h2>
          <div className="inicio-caracteristicas">
            {CARACTERISTICAS.map(({ Icono, titulo, texto }) => (
              <div key={titulo} className="inicio-caracteristica">
                <span className="inicio-caracteristica-icono">
                  <Icono width={24} height={24} />
                </span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contenedor inicio-seccion">
        <div className="inicio-sobre">
          <div className="inicio-sobre-imagen">
            <img src={senalando} alt="" width="220" height="220" />
          </div>
          <div className="inicio-sobre-texto">
            <span className="inicio-eyebrow">Sobre Changuito</span>
            <h2>Un almacén de barrio pensado para comprar desde casa</h2>
            <p>
              Changuito reúne los productos cotidianos del almacén, muestra sus
              precios con claridad y te deja armar el carrito de forma rápida y
              sencilla.
            </p>
            <p>
              Detrás hay un equipo que lo diseña y lo desarrolla paso a paso.
              Conocelo en la página Nosotros.
            </p>
            <Boton variante="principal" to="/nosotros">
              Conocer más sobre Changuito →
            </Boton>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
