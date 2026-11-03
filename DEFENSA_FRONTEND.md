# Guía de defensa (frontend)

Las preguntas del material de la cátedra (`docs/Frontend_con_React.pdf`) y los
8 criterios de `docs/Rubrica_Apis_Interactivas.pdf`, respondidos contra el
código real de este proyecto. No son respuestas de manual: cada una apunta a
un archivo concreto que se puede abrir durante la defensa.

> Lo que se evalúa no es que la interfaz funcione, sino poder explicar por
> qué está hecha así y poder modificarla en el momento.

---

## Arquitectura y estructura del proyecto

**¿Por qué separaron `components/` y `pages/`?**

Porque tienen una responsabilidad distinta, la misma distinción que trae
`Frontend_con_React.pdf`: una página (`src/pages/`) es una pantalla completa,
con su propia ruta; un componente (`src/components/`) es una pieza que varias
páginas pueden reusar. `Boton.jsx`, `CampoFormulario.jsx`, `Recuadro.jsx` y
`Etiqueta.jsx` (en `components/ui/`) se usan en prácticamente las 15 páginas
de la app — si estuvieran copiados adentro de cada página, un cambio de
diseño (por ejemplo, el radio de borde de los botones) implicaría tocar 15
archivos en vez de uno.

**¿Qué responsabilidad tiene cada carpeta de `src/`?**

| Carpeta | Contenido | Responsabilidad |
|---|---|---|
| `pages/` | Una por ruta (`Inicio.jsx`, `Catalogo.jsx`, `admin/ListadoProductos.jsx`...) | Arma una pantalla completa a partir de componentes |
| `components/ui/` | `Boton`, `CampoFormulario`, `Etiqueta`, `Recuadro`, `Migas`, `Iconos`, `EstadoVacio` | Piezas genéricas, sin saber de productos ni de carrito |
| `components/catalogo/`, `carrito/`, `compra/`, `admin/` | `TarjetaProducto`, `FilaCarrito`, `IndicadorPasos`, `FormularioProducto`... | Piezas que sí conocen el dominio, pero no una pantalla entera |
| `context/` | `AuthContext.jsx`, `CartContext.jsx` | Estado compartido entre páginas (sesión y carrito) |
| `services/` | `productosService.js`, `authService.js` | Simulan la API — únicas que tocan `localStorage` para los datos de negocio |
| `utils/` | `validaciones.js`, `validacionesProducto.js`, `formato.js`, `almacenLocal.js` | Funciones puras, sin JSX, reusadas por varias páginas/componentes |
| `data/` | `productos.js`, `categorias.js`, `usuarios.js` | La semilla de datos, con la misma forma que el `DTO` del backend real |

**¿Qué pasaría si todo estuviera en un solo `App.jsx`?**

Dos problemas concretos de este proyecto:

1. **Imposible reusar.** `Boton` se usa con 5 variantes distintas en más de
   20 lugares (`grep -rn "boton-" src/components/ui/Boton.css` muestra las
   5). Sin el componente, cada botón sería JSX copiado y pegado, y corregir
   un detalle de accesibilidad (como el tamaño mínimo de 48px de zona
   táctil) habría que hacerlo uno por uno.
2. **Imposible proteger rutas en un solo lugar.** `RutaProtegida.jsx`
   envuelve `LayoutAdmin` una sola vez en `App.jsx` (línea ~60) y las 4
   páginas de administración quedan protegidas automáticamente, sin
   repetir la verificación de sesión en cada una.

**¿Por qué hay una carpeta `admin/` aparte, con su propio layout y
navbar?**

Porque el lado del comprador y el de administración son, a propósito, dos
experiencias visualmente distintas (`NavbarCliente` clara vs. `NavbarAdmin`
verde oscuro con la etiqueta "Administración") para que durante la demo
nunca se confundan cuál pantalla se está mostrando. Las dos comparten
`CartContext`/`AuthContext` (el mismo `AuthProvider` envuelve toda la app en
`App.jsx`), pero tienen su propio `Layout*.jsx` y su propio set de
componentes de dominio (`components/admin/` vs. `components/catalogo/` y
`carrito/`).

---

## Componentes y Props

**¿Cómo se comunican los componentes entre sí?**

Con props, de padre a hijo — el mismo mecanismo que explica el material de
la cátedra. Ejemplo real y completo, de punta a punta:

```
Catalogo.jsx
  → <TarjetaProducto producto={producto} />      (1 prop: el objeto producto)
      → usa useCart() para leer `agregar`         (no es una prop: viene del Context)
      → <Boton variante="acento" onClick={...}>   (Boton no sabe qué es un producto)
```

`TarjetaProducto` (`src/components/catalogo/TarjetaProducto.jsx`) recibe un
único prop (`producto`) y nunca llama a `productosService` directamente — ni
sabe que existe. Eso es a propósito: separa "cómo se ve una tarjeta" de "de
dónde salen los productos", y permite que `Inicio.jsx` reuse exactamente el
mismo componente para los destacados sin tocar una línea de
`TarjetaProducto.jsx`.

**¿Qué pasa cuando un componente necesita avisarle algo a su padre, no solo
recibir datos?**

Recibe una función por props y la llama. Ejemplo: `FilaProductoAdmin`
recibe `onEliminar` desde `ListadoProductos.jsx` y simplemente hace
`onEliminar(producto)` al hacer clic en "Eliminar" — quien decide qué pasa
después (abrir el modal) es el padre, no la fila.

---

## Hooks: `useState` y `useEffect`

**¿Dónde usan `useState` y para qué?**

En toda la app, siempre que una pantalla necesita recordar algo entre
renders: el texto de un campo (`Registrarse.jsx`), si un modal está abierto
(`productoAEliminar` en `ListadoProductos.jsx`), el carrito completo
(`items` en `CartContext.jsx`). La sesión (`usuarioActual` en
`AuthContext.jsx`) y el carrito son los dos casos "globales": viven en un
Context en vez de en una página, porque los necesitan varias páginas a la
vez (el navbar, el carrito, el checkout).

**¿Dónde usan `useEffect` y para qué?**

Para pedir datos a la capa de servicios cuando se entra a una pantalla —
exactamente el ejemplo de `Tareas.jsx` del material de la cátedra
(`useEffect(() => { fetch(...).then(...) }, [])`), solo que acá el `fetch`
real está reemplazado por `productosService.listarDisponibles()`. Ejemplo
en `Catalogo.jsx`:

```js
useEffect(() => {
  let vigente = true;
  productosService.listarDisponibles().then((datos) => {
    if (vigente) setProductos(datos);
  });
  return () => { vigente = false; };
}, []);
```

El `vigente`/cleanup no está en el material de la cátedra, pero es una
precaución real: si la persona navega a otra pantalla antes de que la
promesa resuelva, evita hacer `setState` sobre un componente que ya se
desmontó.

**¿Por qué no usan Redux u otra librería de estado global?**

Porque alcanza con dos Contexts (`AuthContext`, `CartContext`) y no hay
estado compartido entre pantallas más allá de la sesión y el carrito — el
resto de cada pantalla se resuelve con `useState` local. Agregar Redux
sería más código para resolver el mismo problema (decisión ya tomada en
`PLAN_FRONTEND.md`, sección "Stack").

---

## Renderizado condicional

El patrón es siempre el mismo (if / operador ternario / `&&`, igual que el
material de la cátedra), repetido en cada pantalla que tiene más de un
estado posible. Tres ejemplos reales, elegidos porque cada uno usa una
técnica distinta:

- **`TarjetaProducto.jsx`** — tres estados con un ternario encadenado: si
  no hay stock, muestra "No disponible por ahora" deshabilitado; si se
  acaba de agregar, muestra "Agregado al carrito" (transitorio, 2.2s); si
  no, el botón normal.
- **`Carrito.jsx`** — tres ramas con `if` tempranos: carrito vacío (manda
  `EstadoVacio`), cargando (`"Cargando tu carrito…"`), o la grilla
  completa — ninguna de las tres se superpone.
- **`FilaCarrito.jsx`** — usa `&&` para la rama de "producto no disponible"
  (tarjeta apagada, sin stepper de cantidad) en vez del renderizado normal
  con el selector +/-.

---

## Router (SPA)

**¿Qué es una SPA y por qué esta app lo es?**

Una aplicación que carga un único `index.html` y cambia lo que se ve
actualizando el DOM con JavaScript, sin pedirle al servidor una página
nueva en cada navegación — la misma definición de
`Frontend_con_React.pdf`. Acá se resuelve con `react-router-dom`
(`BrowserRouter`/`Routes`/`Route`/`Link` en `App.jsx`): un clic en
`<Link to="/productos">` cambia la URL y lo que se ve sin recargar.

**¿Cómo protegen las rutas de Administración?**

`RutaProtegida.jsx` envuelve una rama entera de rutas (no cada página por
separado). Sin sesión, o con sesión pero del rol equivocado, hace
`<Navigate to="/iniciar-sesion" state={{ desde: ubicacion }} replace />` —
guarda a dónde se quería ir en el estado de navegación, así
`IniciarSesion.jsx` puede mandar de vuelta ahí después de loguearse en vez
de siempre a `/`. Probado en el paso 3: pedir `/finalizar-compra` sin
sesión → loguearse → vuelve exactamente a `/finalizar-compra`, no a `/`.

**¿Por qué `/administracion` está protegida una sola vez, en el layout, y
no en cada una de las 4 páginas de A1-A5?**

Porque la regla ("sesión de Administrador") es una sola, y repetirla en 4
páginas es 4 lugares donde se podría desincronizar si mañana cambia. En
`App.jsx`:

```jsx
<Route path="/administracion" element={
  <RutaProtegida rolRequerido="Administrador"><LayoutAdmin /></RutaProtegida>
}>
  <Route index element={<ListadoProductos />} />
  ...
</Route>
```

---

## Fetch y la capa de servicios (cómo está simulada la API)

**¿Por qué no usan `fetch` de verdad?**

Porque esta etapa es solo frontend — la consigna explícita del profesor fue
no conectar con el backend todavía (confirmado al arrancar el proyecto, ver
`PLAN_FRONTEND.md`, "Contexto"). La rúbrica lo permite: "se permite trabajar
con datos estáticos, locales o simulados" (`Rubrica_Apis_Interactivas.pdf`,
punto 1).

**¿Entonces cómo simulan la comunicación con el servidor?**

`src/services/productosService.js` y `authService.js` tienen la **misma
forma** que tendría un `fetch` real: funciones `async`, una demora
artificial (`await esperar(400)`, simulando la latency de red) y errores
que hay que atrapar (`throw new Error(...)` en vez de un `response.ok`
falso). Ningún componente llama a `localStorage` directamente — todos pasan
por el servicio, igual que en la app real pasarían por `fetch`.

**El día de la integración, ¿qué cambia?**

Un solo archivo por servicio, ningún componente. Por ejemplo,
`productosService.listarDisponibles` pasaría de:

```js
export async function listarDisponibles() {
  await esperar(DEMORA_MS);
  return obtenerTodosSync().filter((p) => p.disponible);
}
```

a:

```js
export async function listarDisponibles() {
  const respuesta = await fetch(`${API_URL}/api/productos`);
  if (!respuesta.ok) throw new Error("Error al obtener los productos");
  return respuesta.json();
}
```

`Catalogo.jsx` no cambiaría ni una línea: sigue llamando
`productosService.listarDisponibles()` y recibiendo una `Promise` con la
misma forma de array de productos — por eso los datos en `data/productos.js`
imitan exactamente el `ProductoDTO` real del backend (mismos campos,
mismos nombres).

**¿Y CORS?**

No hace falta configurarlo ahora porque no hay ninguna petición cruzando
orígenes — todo vive en el navegador. El día de la integración, con Vite en
`localhost:5173` y Spring Boot en otro puerto, haría falta un
`CorsConfig` del lado del backend permitiendo ese origen (la misma
configuración que ya tiene resuelta el backend real de Changuito, en
`com.tpo.almacen.config.CorsConfig`), exactamente como lo explica
`Frontend_con_React.pdf`.

---

## Formularios, validaciones y estados

Seis formularios en la app (`Registrarse`, `Iniciar sesión`, `Contacto`,
`Finalizar compra`, `Nuevo/Modificar producto`), todos con el mismo patrón
visual (copiado del prototipo, no inventado): un resumen de errores arriba
del formulario que nombra cada campo, y el mismo mensaje repetido al lado
del campo con un ícono — nunca solo con color. Los mensajes desaparecen
recién al corregir y reintentar el envío, no mientras se escribe.

**¿Dónde viven las reglas de validación?**

En `src/utils/validaciones.js` (genéricas: email, teléfono, contraseña,
texto obligatorio — reusadas en Registrarse/Finalizar compra) y
`src/utils/validacionesProducto.js` (específicas de Administración: nombre
mínimo 3, precio con coma decimal, descripción entre 10 y 200). Son
funciones puras — reciben un valor, devuelven el mensaje de error o `null`
— por eso se pueden probar y reusar sin tocar JSX.

**¿Cómo se comunican los estados de éxito/error/espera?**

- **Espera**: el botón cambia de texto ("Confirmando…", "Guardando…") y se
  deshabilita, para que no se pueda enviar dos veces.
- **Éxito**: `ToastCarrito` (global, `aria-live="polite"`) para el carrito;
  una pantalla de éxito dedicada para Contacto y Compra confirmada.
- **Error**: el resumen + mensaje por campo ya descripto, o un
  `Recuadro variante="error"` cuando el error no es de un campo puntual
  (por ejemplo, "Email o contraseña incorrectos" en Iniciar sesión).

---

## Reglas de negocio (verificadas contra el backend real)

Antes de construir Administración (paso 7) se releyó el backend real
(`ProductoRequest`, `ProductoController`, `ProductoService` del repo
`changuito`) para que estas reglas coincidan exactamente, no para que
"parezcan" correctas:

| Regla | Dónde en este proyecto | Coincide con |
|---|---|---|
| El stock se pide al **crear** un producto, nunca al modificar | `FormularioProducto.jsx` (`modo === "crear"` muestra el campo) | `ProductoRequest.stockActual` es obligatorio solo en el alta |
| `disponible` se calcula, no se elige | `productosService.crear`: `disponible: datos.stockActual > 0` | `ProductoService.crear`, misma línea |
| "Eliminar" es baja lógica | `productosService.eliminar` solo cambia `disponible` a `false`, nunca saca el producto del array | `ProductoService.darDeBaja` |
| El login nunca distingue "no existe" de "contraseña mal" | `authService.iniciarSesion`, un solo mensaje para los dos casos | Lo mismo que el backend real, a propósito, para no revelar qué emails existen |
| El registro público siempre crea un Cliente | `Registrarse.jsx` no tiene ningún campo de rol | Regla de negocio explícita |
| La cantidad del carrito es un entero entre 1 y el menor entre 12 y el stock | `CartContext.validarCantidad` | Tope de UX del prototipo + el stock real, los dos a la vez |

---

## Desviaciones del prototipo (documentadas, no accidentales)

El prototipo de diseño (`docs/prototipo/`) es la fuente visual, pero en 8
puntos concretos esta app se aparta de él a propósito — la lista completa,
con el motivo de cada una, está en `PLAN_FRONTEND.md`, sección
"Desviaciones del prototipo". Las más importantes para la defensa:

1. **Categorías**: las 5 reales del backend (Almacén/Bebidas/Lácteos/
   Limpieza/Panadería), no las 5 de ejemplo del prototipo.
2. **Medio de pago**: solo "Transferencia" (la única real), sin selector
   de 3 opciones simuladas.
3. **Login/registro**: no existían en el prototipo original; se agregaron
   completos por pedido explícito, con las reglas exactas del backend.
4. **Stock en "Agregar producto"**: editable (el prototipo lo deja
   siempre en 0), porque el backend real lo pide en el alta.
5. **Filtro "Sin stock" en Administración**: no existe, porque un producto
   disponible con 0 unidades no es un estado alcanzable en el backend real.
6. **Reactivar un producto desactivado**: no está implementado — el propio
   prototipo dice que "no está diseñada en esta etapa".
7. **Selector de imagen en Administración**: no existe, porque ningún
   producto de la app tiene foto real en ningún lado (decisión del paso 1).
8. **Equipo en Nosotros**: dos integrantes reales (Pablo Bustos y Tobias
   Rossi), no los tres de ejemplo del prototipo.

---

## Revisión contra los 8 criterios de la rúbrica

| # | Criterio | Dónde mirar |
|---|---|---|
| 1 | Adecuación al modelo de negocios (15) | Categorías/productos/reglas calcadas del backend real (paso 1); flujo completo comprador + administrador de un almacén de barrio |
| 2 | Estructura y arquitectura (10) | Navbar + migas en cada pantalla, layouts separados cliente/admin, URLs predecibles (`/productos/:id`, `/administracion/productos/:id/editar`) |
| 3 | Semántica y accesibilidad (15) | 0 violaciones de `axe-core` en 21 pantallas/estados (paso 8): jerarquía de encabezados, `<label>` asociado, `aria-label` en botones solo-ícono, `aria-live`, foco visible, navegación 100% por teclado |
| 4 | Diseño visual y usabilidad (15) | Un solo sistema de diseño (`src/index.css`), sin colores fuera de los aprobados, consistente en las 15 páginas |
| 5 | Adaptabilidad a dispositivos (10) | 0 desbordes horizontales de 320 a 1280px en todas las rutas (paso 8), 4 bugs reales de responsive encontrados y corregidos |
| 6 | Interacción y comportamiento (15) | Cada flujo probado de punta a punta con Playwright en su propio paso: carrito, filtros, checkout, ABM completo, modal de confirmación |
| 7 | Formularios, validaciones y estados (10) | 6 formularios con etiquetas, validaciones y mensajes propios, resumen + error por campo, estados de éxito/espera/vacío |
| 8 | Calidad técnica (10) | Componentes chicos y reusados a propósito (`Boton`, `CampoFormulario`, `FormularioProducto` compartido), capa de servicios separada de las páginas, `oxlint` revisado |

---

## Preguntas que conviene tener preparadas

Cosas del proyecto que un evaluador atento va a notar.

**Encontraron y corrigieron un bug real durante el desarrollo — ¿cuál fue?**

Una condición de carrera en Finalizar compra (paso 5). Al confirmar, vaciar
el carrito y navegar a la pantalla de confirmación pasaban en el mismo
evento. Eso podía disparar el guard de "carrito vacío → volver a
`/carrito`" de `FinalizarCompra` *después* de la navegación a la
confirmación, pisándola con un segundo `replace` y dejando a la persona de
vuelta en un carrito vacío en lugar de ver la pantalla de éxito. Se
solucionó moviendo `vaciar()` a un `useEffect` dentro de
`CompraConfirmada.jsx`, que se dispara una vez montada con datos válidos —
así el carrito sigue teniendo productos durante toda la navegación de
`FinalizarCompra` y el guard nunca llega a dispararse. No se encontró
leyendo el código: se encontró probando el flujo completo con Playwright y
viendo que la captura no era la esperada.

**¿Por qué `localStorage` y no `sessionStorage` o nada?**

Para que una recarga de página durante la demo no pierda el carrito, la
sesión ni los productos creados en Administración — `sessionStorage` se
pierde al cerrar la pestaña, y sin persistencia habría que rearmar todo en
cada recarga.

**¿Qué pasa si localStorage falla (modo privado, storage lleno)?**

`src/utils/almacenLocal.js` envuelve cada lectura/escritura en un
`try/catch`: si falla, la app sigue funcionando igual, solo que sin
recordar el estado entre recargas. Ninguna pantalla se rompe por esto.

**¿Por qué el carrito no reserva stock al agregar un producto?**

La misma razón que el backend real: si el carrito reservara stock, dos
personas mirando el mismo producto sin intención real de comprar
bloquearían mercadería. La validación real (contra el stock) ocurre en
`CartContext.validarCantidad` cada vez que se agrega o cambia una
cantidad, no al "reservar" nada de antemano.

**¿Qué pasa si un producto se da de baja mientras está en el carrito de
alguien?**

Aparece en `Carrito.jsx` como "No disponible", excluido del total, sin
romper la pantalla — y no hace falta código especial para ese caso: el
carrito solo guarda `{idProducto, cantidad}` (nunca copia nombre ni
precio), así que cada línea se resuelve contra `productosService.obtener`
en el momento de mostrarla. Es consecuencia natural de ese diseño, no un
caso aparte.

**Si te piden modificar algo en vivo**

| Pedido | Dónde |
|---|---|
| Cambiar una regla de validación | `src/utils/validaciones.js` o `validacionesProducto.js` |
| Cambiar el tope de cantidad del carrito | `CANTIDAD_MAXIMA` en `CartContext.jsx` |
| Agregar una categoría | `src/data/categorias.js` (y el backend real, si se integrara) |
| Cambiar qué pasa al confirmar una compra | `FinalizarCompra.jsx`, función `manejarSubmit` |
| Agregar un campo al formulario de producto | `FormularioProducto.jsx` + su validación en `validacionesProducto.js` |
| Cambiar el texto de un aviso | `Recuadro`/`ToastCarrito` donde se usa, o las constantes `AVISOS` de `ListadoProductos.jsx` |
| Proteger una ruta nueva | Envolver en `<RutaProtegida>` dentro de `App.jsx`, no en la página |
