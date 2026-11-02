# Plan del frontend de Changuito (Etapa 2 — solo interfaz)

Documento de referencia para todo el desarrollo. Cumple el mismo rol que
`DISEÑO.md` y `CONTEXTO_NEGOCIO.md` en el backend: se lee completo antes de
tocar código, y cada decisión que contradice al prototipo original está
explicada, no escondida.

## Contexto

Changuito es un almacén de barrio con venta online. Ya existe el backend
(Spring Boot + MySQL, repo `changuito`, categorías reales: Almacén, Bebidas,
Lácteos, Limpieza, Panadería). Esta etapa es **solo frontend**, evaluada de
forma independiente con `docs/Rubrica_Apis_Interactivas.pdf`. **No hay que
conectar con el backend**: todos los datos son locales/simulados, y así debe
quedar. No se penaliza la falta de conexión ni de persistencia real.

Material de referencia de la cátedra: `docs/Frontend_con_React.pdf` (Vite +
React + react-router-dom + fetch, estructura `src/components` y `src/pages`).

Prototipo de diseño ya aprobado: `docs/prototipo/` (export de Claude Design).
Es la fuente de verdad visual y de contenido para TODO excepto lo listado en
"Desviaciones del prototipo" — no reinterpretar el diseño, construir fiel a lo
que ahí está. Archivos clave a abrir antes de escribir código:

- `docs/prototipo/Mapa-de-pantallas.dc.html` — las 13 pantallas originales, su
  código (C1-C8, A1-A5) y qué hace cada una.
- `docs/prototipo/Identidad-Componentes.dc.html` y `Main.dc.html` — paleta de
  colores, tipografía, botones, reglas de forma (radios, sombras, espaciado),
  tono de los textos. **Ya volcado a código** en `src/index.css` y
  `src/components/ui/` (ver "Lo que ya está hecho").
- `docs/prototipo/Catalogo-Estados.dc.html`, `Compra-Estados.dc.html`,
  `Admin-Estados.dc.html` — TODOS los estados de cada pantalla, con el texto
  exacto de cada mensaje de error y de éxito. Copiar los textos tal cual están
  ahí, salvo donde se indique lo contrario abajo.
- `docs/prototipo/Flujo-comprador.dc.html`, `Flujo-administrador.dc.html` — el
  recorrido entre pantallas (ahora con las pantallas de sesión agregadas, ver
  más abajo).
- `docs/prototipo/img/festejo.png`, `senalando.png`, `pulgar.png` — las únicas
  imágenes del proyecto. Ya copiadas a `src/assets/marca/`. Reusar, no generar
  otras.

## Desviaciones del prototipo (decididas, con motivo)

1. **Categorías**: usar las 5 del backend real — Almacén, Bebidas, Lácteos,
   Limpieza, Panadería — en vez de las 5 que trae el prototipo (Almacén,
   Bebidas sin alcohol, Limpieza, Cuidado personal, Frescos). Motivo: evitar
   fricción cuando se integre con el backend más adelante.
2. **Medio de pago**: el prototipo muestra 3 opciones simuladas (Efectivo,
   Tarjeta, Transferencia). El backend real solo tiene UNA: "Transferencia".
   En "Finalizar compra" no va un selector de 3 opciones: va una tarjeta fija,
   no interactiva, que dice "Medio de pago: Transferencia (simulado)", con el
   mismo texto explicativo que el prototipo ya usa para Transferencia
   ("Simulado: no se muestran datos bancarios"). No hay validación de "elegí
   un medio de pago" porque no hay nada que elegir.
3. **Login, registro y roles**: el prototipo decía explícitamente que no había
   pantalla de ingreso ("todavía no existe autenticación"). Eso cambió: ahora
   SÍ hay login y registro simulados, descriptos en detalle en "Autenticación".
   El botón "Administración · Demo" del prototipo NO se implementa — se
   reemplaza por el flujo de login real.
4. **Finalizar compra (C5)**: el prototipo pedía "Nombre y apellido" y "Correo
   electrónico" como campos de texto libres. Como ahora hay sesión, esos dos
   campos NO se piden: se muestra un renglón fijo "Comprando como: {nombre}
   {apellido} ({email})" tomado de la sesión. Lo que sí se sigue pidiendo:
   forma de entrega, dirección (solo si es envío a domicilio) y observaciones
   (opcional, hasta 200 caracteres).

## Stack (decidido, no renegociar sin motivo)

- Vite + React, JavaScript (sin TypeScript).
- react-router-dom para las rutas.
- Componentes funcionales, useState/useEffect, Context API (para el carrito Y
  para la sesión — ver "Autenticación").
- CSS plano por componente (un .css por cada .jsx, como en el material de la
  cátedra), más `src/index.css` con los tokens de diseño globales.
- Sin librerías de UI (nada de Tailwind/Bootstrap/MUI), sin librería de
  íconos (SVG propios en `src/components/ui/Iconos.jsx`), sin librería de
  formularios (validación a mano con useState).
- Capa `src/services/` que simula una API async con delay artificial
  (~400ms), misma forma que tendría un fetch real, para poder reemplazarla
  sin tocar componentes el día de la integración full-stack. Incluye
  `productosService.js` y `authService.js` (login, registrar).
- `localStorage` para: el carrito, la lista de usuarios (semilla +
  registrados nuevos) y la sesión activa. Así una recarga de página durante
  la defensa no pierde el progreso.

## Autenticación (simulada, sin seguridad real)

- `src/context/AuthContext.jsx`: expone `usuarioActual` (null o
  `{id, nombre, apellido, email, rol}`), `iniciarSesion(email, contrasena)`,
  `registrar(datos)`, `cerrarSesion()`.
- `src/services/authService.js`: opera sobre `src/data/usuarios.js` (array
  persistido en localStorage, inicializado con la semilla si está vacío).
  - `iniciarSesion`: si el email no existe O la contraseña no coincide,
    lanza el MISMO error en los dos casos: "Email o contraseña incorrectos"
    — igual que hace el backend real, a propósito, para no revelar qué
    emails existen.
  - `registrar`: valida igual que el backend (ver tabla de validaciones),
    tira error si el email ya está tomado, y SIEMPRE asigna rol "Cliente" —
    el formulario de registro no tiene ningún campo para elegir rol, nunca.
- Semilla de usuarios (**editar nombre/apellido de chenzito antes de la
  defensa** — están sin confirmar):
  ```
  adminchanguito@gmail.com / 123456 / rol Administrador / nombre "Admin Changuito"
  chenzito@gmail.com       / 123456 / rol Cliente       / nombre "[completar]"
  ```
- Rutas protegidas:
  - `/administracion/*` requiere `usuarioActual.rol === 'Administrador'`; si
    no, redirige a `/iniciar-sesion`.
  - `/finalizar-compra` requiere cualquier `usuarioActual` logueado; si no,
    redirige a `/iniciar-sesion` (el carrito se conserva).
- Pantallas nuevas:
  - `IniciarSesion.jsx` → `/iniciar-sesion` — email + contraseña, link a
    Registrarse. Al loguear, si rol es Administrador va a `/administracion`,
    si es Cliente vuelve a donde intentaba ir (o a `/` por defecto).
  - `Registrarse.jsx` → `/registrarse` — nombre, apellido, email, teléfono,
    contraseña, checkbox obligatorio de Política de Privacidad. Validación
    idéntica a la del backend (ver tabla abajo). Al registrarse con éxito,
    inicia sesión automáticamente como Cliente.
  - `PoliticaDePrivacidad.jsx` → `/politica-de-privacidad` — página
    estática. Explica qué datos se piden (registro, Contacto, checkout),
    que es una simulación académica y que lo guardado vive solo en
    localStorage del navegador, no en ningún servidor. Linkeada desde
    Registrarse (checkbox), Contacto (debajo del botón de enviar) y el pie
    de página.

## Lo que ya está hecho

### Paso 1 — andamiaje y sistema de diseño

- Proyecto Vite + React scaffoldeado, `react-router-dom` instalado.
- `index.html`: lang="es-AR", fuentes de Google Fonts (Manrope + Source Sans
  3), favicon con `pulgar.png`.
- `src/index.css`: todos los tokens de color/tipografía/forma/espaciado del
  documento de identidad, reset base, tipografía global (h1/h2/h3 en
  Manrope color verde oscuro, cuerpo en Source Sans 3 color texto), clase
  `.contenedor` (ancho máximo 1200px), `.visualmente-oculto` (texto solo
  para lector de pantalla) y un breakpoint a 768px.
- `src/assets/marca/`: las tres imágenes del personaje.
- `src/components/ui/Iconos.jsx`: 10 íconos propios SVG a mano, 24px, trazo
  1.75 (los 8 de Identidad-Componentes.dc.html + Menú/Cerrar para el nav
  mobile, que el prototipo no tenía diseñados todavía).
- `src/components/ui/Boton.jsx` (+ css): las 5 variantes (principal, acento,
  secundario, destructivo, enlace), usable como `<button>`, `<a href>` o
  `<Link to>`.
- `src/components/ui/CampoFormulario.jsx` (+ css): label + input/select/
  textarea + ayuda/error, con aria-describedby y aria-invalid.
- `src/components/ui/Etiqueta.jsx` (+ css): las 5 etiquetas de estado
  (disponible, sin-stock, oferta, guardado, desactivado).

### Paso 2 — datos, servicios, layouts, navegación y Context

- `src/data/categorias.js`, `productos.js` (21 productos), `usuarios.js`
  (las 2 cuentas demo). Los campos de producto imitan a propósito la forma
  de `ProductoDTO` del backend (ver comentario en el archivo).
- `src/utils/almacenLocal.js`: wrapper de localStorage con try/catch.
- `src/services/productosService.js` (solo lectura por ahora: listarTodos,
  listarDisponibles, obtener — las operaciones de escritura se agregan en
  el paso de Administración) y `authService.js` (iniciarSesion, registrar,
  cerrarSesion, obtenerSesion) — las dos con demora artificial de 400ms.
- `src/context/AuthContext.jsx` y `CartContext.jsx`. El carrito valida
  contra `productosService.obtener` (disponibilidad + tope de 12 o el
  stock, lo que sea menor) y no está atado a ningún usuario — igual que el
  carrito del backend real, que tampoco reserva stock.
- `src/components/layout/`: `NavbarCliente` (con menú hamburguesa en
  mobile), `NavbarAdmin`, `Footer`, `LayoutCliente`, `LayoutAdmin`,
  `RutaProtegida` (guarda de rutas por sesión/rol).
- `App.jsx` con el árbol de rutas completo (las 15 páginas + el árbol
  cliente/admin con sus dos layouts). Las páginas todavía son placeholders
  de una línea — se completan en los pasos 3 a 7, sin tocar el ruteo de
  nuevo.
- Verificado con `npm run build`, con capturas reales (desktop y mobile,
  con el menú abierto) y simulando una sesión de administrador en
  localStorage para probar que `/administracion` deja de redirigir a
  `/iniciar-sesion` una vez logueado, y que el navbar del cliente muestra
  "Ir a Administración" cuando corresponde.

### Paso 3 — login, registro y política de privacidad

- `src/utils/validaciones.js`: funciones puras (validarEmail, validarTexto,
  validarTelefono, validarContrasena, sinVacios), reusadas en Registrarse y
  preparadas para Contacto/Finalizar compra/Admin más adelante.
- `src/components/ui/Recuadro.jsx` (+ css): la caja informativa con ícono
  del prototipo (mostaza para avisos, roja para resúmenes de error),
  reusada en todas las pantallas nuevas.
- `src/components/ui/Migas.jsx` (+ css): breadcrumb, reusado también en
  estas tres pantallas (el prototipo lo usa en Catálogo/Contacto/Admin).
- `IniciarSesion.jsx`: una sola pantalla para los dos roles. Redirige según
  el rol que devuelve la sesión — Administrador siempre a
  `/administracion`, Cliente a donde intentaba ir (`location.state.desde`)
  o a `/`. Muestra las dos cuentas de prueba en el recuadro informativo,
  para que probarlo no dependa de acordarse las credenciales.
- `Registrarse.jsx`: nombre, apellido, email, teléfono, contraseña,
  checkbox obligatorio de Política de Privacidad (abre en pestaña nueva
  para no perder el formulario a medio llenar). Nunca pide ni manda rol.
  Resumen de errores arriba + mensaje repetido en cada campo, como pide el
  patrón del prototipo. Al registrarse, inicia sesión sola y redirige igual
  que el login.
- `PoliticaDePrivacidad.jsx`: página estática. Qué se pide, para qué se
  usa, dónde queda guardado (localStorage, con la honestidad de que las
  contraseñas no están cifradas por no haber servidor) — linkeada desde el
  checkbox de Registrarse, el pie de página, y pendiente Contacto (paso 6).
- Verificado con Playwright de punta a punta, no solo "compila": el
  resumen de errores con los 6 campos vacíos, el error específico cuando
  falta solo la política, el error genérico de login con la cuenta admin y
  contraseña incorrecta, y el flujo completo de pedir `/finalizar-compra`
  sin sesión → login como `chenzito@gmail.com` → vuelve exactamente a
  `/finalizar-compra` (no a `/`).

### Paso 4 — Catálogo, detalle, carrito e Inicio

- `src/components/ui/EstadoVacio.jsx` (+ css): mascota + título + texto +
  botón, reusado en catálogo sin resultados y carrito vacío.
- `src/components/catalogo/`: `TarjetaProducto.jsx` (+ css) con sus 3
  estados (normal, "Agregado al carrito" transitorio por 2.2s, sin stock),
  `Buscador.jsx`, `FiltroCategoria.jsx` (pills con contador, incluido
  "Todos"), `OrdenPorPrecio.jsx` (dos botones, no un `<select>`).
- `Catalogo.jsx` (+ css, C2): usa `useSearchParams` para `?categoria=N`
  (así el link desde Inicio/navbar llega filtrado), `useMemo` para
  filtrar+ordenar sin recalcular de más, y tres variantes de estado vacío
  según el caso (sin productos en la categoría, búsqueda sin resultados,
  catálogo vacío).
- `DetalleProducto.jsx` (+ css, C3): `useParams`, stepper de cantidad con
  `aria-label="Restar/Sumar una unidad"` igual que el prototipo, tarjeta de
  "agregado" que queda fija (a diferencia de la de la tarjeta de grilla,
  que es transitoria).
- `src/components/carrito/`: `FilaCarrito.jsx` (+ css) — la pieza más
  delicada: el campo de cantidad es tipeable (no solo +/-), valida en cada
  tecla contra un estado local de texto separado de `item.cantidad`, y
  solo llama a `actualizarCantidad` cuando el valor es válido; tiene una
  rama aparte para productos ya no disponibles (tarjeta apagada, sin
  stepper, "No se incluye" en vez de subtotal). `ResumenCarrito.jsx` (+
  css) — el botón "Finalizar compra" se renderiza como `<button disabled>`
  en vez de `Boton to=...` cuando no se puede finalizar, porque un `<Link>`
  ignora el atributo `disabled`.
- `ToastCarrito.jsx` (+ css): aviso global ("Se agregó al carrito"),
  montado una sola vez en `LayoutCliente`, se lee del nuevo campo `aviso`
  de `CartContext` y se cierra solo a los 3.5s (`aria-live="polite"`).
- `src/components/compra/IndicadorPasos.jsx` (+ css): el stepper de 3 pasos
  (Carrito / Datos y pago / Confirmación) del prototipo, reusado también
  en el paso 5.
- `Carrito.jsx` (+ css, C4): el carrito en `CartContext` solo guarda
  `{idProducto, cantidad}` — cada línea se resuelve contra
  `productosService.obtener` al entrar a la pantalla, nunca se guarda el
  producto completo. Por eso un producto dado de baja **después** de
  agregado al carrito aparece solo como "no disponible" (y se excluye del
  total) en vez de romper la pantalla, sin código especial para ese caso:
  es consecuencia natural de no persistir datos de producto en el carrito.
- `Inicio.jsx` (+ css, C1): hero, 5 tarjetas de categoría, 4 productos
  destacados (uno de cada rubro, fijo a propósito — no es una selección
  "inteligente"), franja "Por qué Changuito", sección partida con CTA a
  Nosotros.
- Verificado con Playwright, incluido un caso que al principio dio un
  falso negativo: simular que un producto se da de baja estando en el
  carrito de alguien requiere que `changuito_productos` ya exista en
  localStorage (el servicio lee la semilla en memoria si la clave no
  existe, pero nunca la persiste en una simple lectura — sólo
  `_guardarTodos`, sin usar todavía, escribe). El primer intento de prueba
  mutaba sobre una clave inexistente y no hacía nada; repetido
  escribiendo la semilla antes de mutar, se confirmó que `FilaCarrito`
  muestra bien la tarjeta apagada, excluye el producto del total (0
  unidades, $0) y deshabilita "Finalizar compra". También verificado:
  catálogo y detalle en mobile (390px), y que el índice de un test
  anterior (no la app) había apuntado mal una tarjeta al clickear por
  posición en vez de por nombre — confirmado reproduciendo con un locator
  por texto que "Agregar al carrito" agrega el producto correcto.

### Paso 5 — Finalizar compra y confirmación

- `FinalizarCompra.jsx` (+ css, C5): "Tus datos" y "Medio de pago" no son
  formularios (ver "Desviaciones del prototipo" #2 y #4) — nombre/apellido/
  correo salen de la sesión ("Comprando como {nombre} {apellido}
  ({email})") y el medio de pago es una tarjeta fija "Transferencia
  (simulado)", sin selector. Lo único que se valida es "Entrega": dos
  tarjetas tipo radio (domicilio/retiro), dirección obligatoria solo con
  domicilio, observaciones opcionales con tope duro de 200 caracteres
  (`maxLength`, no un error post-submit — más simple y nunca deja el campo
  en un estado inválido). Si el carrito queda vacío o sin ningún producto
  disponible (incluso entrando directo por URL), redirige a `/carrito`.
- `src/components/compra/ResumenPedido.jsx` (+ css): "Resumen del pedido"
  con cada línea (cantidad × precio unitario → subtotal) y el total,
  reusado en C5 (con link "Editar carrito") y C6 (sin él, porque ahí el
  carrito ya está vacío). Distinto de `ResumenCarrito.jsx` del paso 4, que
  es el resumen corto del Carrito con el botón "Finalizar compra".
- `CompraConfirmada.jsx` (+ css, C6): como no hay backend, no existe nada
  que "guardar" — todo lo que se muestra viaja en `location.state`, puesto
  una sola vez al confirmar (número de operación `DEMO-XXXXXX` generado al
  azar, resumen de líneas, datos de entrega). Entrar directo a esta URL (o
  refrescar la página) no tiene `state` y redirige a Inicio, igual que si
  el pedido nunca hubiera existido.
- Bug real encontrado y corregido durante la verificación (no un problema
  del test): al confirmar, vaciar el carrito y navegar a
  `/compra-confirmada` pasaban en el mismo evento. Eso podía disparar el
  guard de "carrito vacío → volver a `/carrito`" de `FinalizarCompra`
  *después* de la navegación a la confirmación pero *antes* de que el
  componente llegara a desmontarse, pisando con un segundo
  `replace` la URL de confirmación y dejando al usuario de vuelta en un
  carrito vacío en lugar de ver la pantalla de éxito. Se solucionó moviendo
  `vaciar()` a un `useEffect` dentro de `CompraConfirmada` (se vacía ahí,
  una vez montada con un `state` válido), así el carrito sigue teniendo
  productos durante toda la navegación de `FinalizarCompra` y el guard
  nunca llega a dispararse.
- Verificado con Playwright: pantalla completa, el error de dirección
  obligatoria (y que desaparece al cambiar a "Retiro en el local" o al
  volver a elegir "Entrega a domicilio"), la compra confirmada completa
  (con los datos de entrega y el resumen correctos, y el carrito en 0
  después), los dos *guards* de navegación directa (sin `state` → Inicio;
  carrito vacío → Carrito) probados con una pestaña nueva para no arrastrar
  `history.state` de la navegación anterior, y mobile (390px).
- Pendiente para antes de la defensa (ya estaba anotado desde el paso 3,
  sigue sin resolver): completar el nombre y apellido reales de la cuenta
  `chenzito@gmail.com` en `src/data/usuarios.js` — hoy dice "[completar]
  [completar]" y ahora se ve también en "Comprando como..." de Finalizar
  compra y en el saludo de Compra confirmada.

## Notas del prototipo renderizado (para los próximos pasos)

El texto de los archivos `.dc.html` no alcanza para construir fiel al
prototipo — hay que **renderizarlos** (sirven como HTML estático con
`npx http-server docs/prototipo` + Playwright) y mirarlos, porque tienen
detalles que no están en el texto. Lo que ya se relevó así:

- **Inicio (C1)**: hero con fondo verde, pill de categoría, título, dos
  botones (acento + outline sobre fondo oscuro), y a la derecha un recuadro
  "Foto de referencia" con el mascota superpuesta. Después: grilla de 5
  categorías (ícono + nombre + "Ver productos →"), 4 productos destacados,
  una franja "Por qué Changuito" con 4 íconos, y una sección partida
  imagen/texto con CTA a Nosotros.
- **Catálogo (C2)**: breadcrumb "Inicio / Productos". Buscador de ancho
  completo + **dos botones de orden** ("↑ Menor a mayor" / "↓ Mayor a
  menor") a la derecha — no es un `<select>`. Debajo, pills de categoría
  **con contador** ("Almacén 6", incluido "Todos 13"), y un renglón
  "Mostrando X de Y productos". Grilla de 4 columnas con la misma tarjeta
  de producto que Inicio.
- **Tarjeta de producto**: recuadro "Foto del producto" (ícono + texto, sin
  imagen real) con la etiqueta de disponibilidad superpuesta arriba a la
  izquierda y la categoría al lado; debajo nombre, precio grande, y dos
  botones apilados: "Ver detalle" (secundario) + "Agregar al carrito"
  (acento) o "No disponible por ahora" (deshabilitado) si no hay stock.
- **Administración (A1)**: NO es una grilla de tarjetas, es una **tabla**:
  columnas Imagen / Producto / Categoría / Precio / Disponibilidad (badge +
  "Stock: N unidades" debajo) / Acciones (Editar + Eliminar, los dos
  outline). Arriba: breadcrumb, título, pills de filtro con contador
  (Todos/Disponibles/Sin stock/Desactivados) y el botón "+ Agregar
  producto". Abajo de la tabla hay dos renglones de aclaración ("Eliminar
  no borra el producto...") que conviene adaptar, no copiar tal cual
  (hablan del prototipo, no de esta app ya construida).
- **Navbar mobile**: SÍ tiene menú hamburguesa (botón cuadrado verde oscuro
  con tres líneas, al lado del carrito) — no se ve en una captura estática
  porque empieza cerrado. Ya implementado en `NavbarCliente.jsx`.
- **Contacto (C8)**: dos columnas en escritorio — a la izquierda una
  tarjeta blanca con el formulario (Nombre y apellido, Correo, Asunto,
  Mensaje con contador "0 / 500"), a la derecha otra tarjeta "Otros datos
  de contacto" con los mismos placeholders entre corchetes del pie de
  página. Breadcrumb arriba, pill "Formulario simulado" junto al título.
- **Nosotros (C7)**: **los nombres de dos de los tres integrantes están
  confirmados en el propio prototipo**: "Pablo Bustos" y "Tobias Rossi". El
  tercero solo tiene apellido: "[Nombre] De Vincenzo". Usar estos nombres
  tal cual en la pantalla real (paso 6) — no son un dato de ejemplo, el pie
  de esa sección lo aclara explícitamente ("Los nombres de Pablo Bustos y
  Tobias Rossi son los indicados por el equipo"). Tarjeta de cada
  integrante: foto placeholder (ícono de persona, borde punteado) + Nombre
  completo + Participación o rol (placeholder) + Presentación personal
  (placeholder, 2-3 líneas). Arriba: 4 tarjetas "Qué es Changuito y qué
  propone" (ícono + título + texto) y una caja mostaza "Qué es real y qué
  es simulado hoy".
- **Caja informativa con ícono** (mostaza, fondo tintado suave): es la
  misma pieza que usa el prototipo para avisos informativos (Nosotros) y
  para el resumen de error arriba de un formulario (Compra-Estados), solo
  cambia el color. Se implementa una sola vez como `Recuadro.jsx`
  (variantes `info`/`error`), reusada en toda la app — incluida la nota de
  "esto es una simulación académica" de Iniciar sesión/Registrarse, que no
  estaba en el prototipo original pero usa su mismo lenguaje visual.

## Estructura de carpetas esperada

## Estructura de carpetas esperada

```
src/
  main.jsx, App.jsx
  context/
    CartContext.jsx
    AuthContext.jsx
  data/
    productos.js          (seed: ~18-20 productos, 5 categorías del BACKEND)
    usuarios.js            (seed: las 2 cuentas de arriba)
  services/
    productosService.js   (listar, obtener, crear, actualizar, eliminar — simulan API)
    authService.js         (iniciarSesion, registrar)
  utils/
    validaciones.js        (funciones puras, reusadas en los formularios)
  components/
    layout/   NavbarCliente.jsx, NavbarAdmin.jsx, Footer.jsx, LayoutCliente.jsx,
              LayoutAdmin.jsx, RutaProtegida.jsx (guard de rutas por rol)
    ui/       Boton.jsx, CampoFormulario.jsx, Etiqueta.jsx, Iconos.jsx (HECHOS),
              Aviso.jsx (toast de éxito, con aria-live),
              EstadoVacio.jsx (reutilizable: carrito vacío / sin resultados / sin
                productos en categoría — las tres comparten forma)
    catalogo/ TarjetaProducto.jsx (3 estados), Buscador.jsx, FiltroCategoria.jsx
              (pills con contador), OrdenPorPrecio.jsx (2 botones, no es un
              select — ver "Notas del prototipo renderizado")
    carrito/  FilaCarrito.jsx, ResumenCarrito.jsx
    admin/    FilaProductoAdmin.jsx, ModalConfirmarEliminacion.jsx
  pages/
    Inicio.jsx                         -> "/"                              (C1)
    Catalogo.jsx                       -> "/productos"                     (C2)
    DetalleProducto.jsx                -> "/productos/:id"                 (C3)
    Carrito.jsx                        -> "/carrito"                      (C4)
    FinalizarCompra.jsx                -> "/finalizar-compra" (*)           (C5)
    CompraConfirmada.jsx               -> "/compra-confirmada"             (C6)
    Nosotros.jsx                       -> "/nosotros"                      (C7)
    Contacto.jsx                       -> "/contacto"                      (C8)
    IniciarSesion.jsx                  -> "/iniciar-sesion"                (L1)
    Registrarse.jsx                    -> "/registrarse"                   (L2)
    PoliticaDePrivacidad.jsx           -> "/politica-de-privacidad"        (L3)
    admin/ListadoProductos.jsx         -> "/administracion" (*)            (A1)
    admin/DetalleProductoAdmin.jsx     -> "/administracion/productos/:id" (*) (A2)
    admin/ModificarProducto.jsx        -> "/administracion/productos/:id/editar" (*) (A3)
    admin/NuevoProducto.jsx            -> "/administracion/productos/nuevo" (*) (A5)
    (*) = ruta protegida, ver "Autenticación"
    (A4, confirmar eliminación, es un modal abierto desde A1/A2, no una ruta)
```

## Reglas de negocio a respetar aunque no haya backend

- El stock es de solo lectura en los formularios de producto (crear/editar).
  No se ingresa a mano en la edición, coincide con la regla real del
  backend.
- "Eliminar" un producto en administración es baja lógica: pasa a
  "Desactivado", no desaparece del listado ni dispara ninguna acción
  destructiva real.
- La cantidad en el carrito es un entero entre 1 y el mínimo entre 12 y el
  stock simulado del producto.
- Un producto sin stock no se puede agregar al carrito (botón desactivado,
  con el texto exacto del prototipo: "No disponible por ahora").
- La dirección de entrega solo es obligatoria si se elige "entrega a
  domicilio".
- El medio de pago es fijo: Transferencia, simulado, sin selector (ver
  "Desviaciones del prototipo").
- El registro público SIEMPRE crea un usuario con rol Cliente. Nunca
  ofrecer la opción de elegir rol en ese formulario.
- El login nunca distingue, en el mensaje de error, entre "ese email no
  existe" y "la contraseña está mal". Siempre el mismo texto.

## Validaciones por formulario

Contacto y Finalizar compra (dirección/entrega/observaciones): ver
`Compra-Estados.dc.html`, ignorando las filas de Nombre/Correo/Medio de pago
que ya no aplican (ver "Desviaciones").

Modificar/Nuevo producto (admin): ver `Admin-Estados.dc.html` tal cual — esas
reglas (nombre mínimo 3, descripción mínima 10) son más estrictas que el
backend real a propósito, y no entran en conflicto con él.

Registrarse (nueva, replica exacto al backend — no inventar límites
distintos):

| Campo       | Regla                                           |
|-------------|--------------------------------------------------|
| Nombre      | Obligatorio, hasta 100 caracteres                |
| Apellido    | Obligatorio, hasta 100 caracteres                |
| Email       | Obligatorio, formato válido, hasta 150 caracteres|
| Teléfono    | Obligatorio, EXACTAMENTE 10 dígitos, solo números|
| Contraseña  | Obligatoria, entre 6 y 100 caracteres            |
| Política de privacidad | Checkbox obligatorio                 |

Iniciar sesión (nueva): email con formato válido, contraseña no vacía. El
error de "no coincide" sale recién al intentar loguear, nunca antes.

Patrón de UI a replicar en los formularios con varios campos (Contacto,
Finalizar compra, Registrarse, Modificar/Nuevo producto): al fallar el submit
aparece un resumen arriba del formulario listando cada campo con error, y
cada campo repite su mensaje al lado, con ícono. Los mensajes desaparecen al
corregir, sin esperar a un nuevo submit.

## Accesibilidad — checklist concreto

- HTML semántico: header/nav/main/footer/section/article, un solo `<h1>` por
  página.
- Todo `<label>` asociado a su input (htmlFor/id) — ya resuelto por
  `CampoFormulario`.
- Botones solo-ícono (como el carrito de la tarjeta de producto) con
  aria-label.
- Avisos de éxito en una región `aria-live="polite"`.
- Contraste: usar exactamente los colores del documento de identidad, que ya
  vienen con los ratios de contraste verificados — no inventar combinaciones
  nuevas (ej.: nunca texto mostaza sobre fondo claro).
- Navegación completa por teclado (elementos nativos, sin trampas de foco) —
  el anillo de foco global ya está en `src/index.css`.

## Responsive

Mobile-first. El prototipo ya tiene versión mobile de varias pantallas
(Landing-Movil, Catalogo-Movil, Contacto-Movil, Nosotros-Movil, y la barra de
navegación angosta descripta en Identidad-Componentes): una columna, botones
a todo el ancho. Breakpoint simple en ~768px (ya en `src/index.css`). Las
pantallas nuevas (login, registro, política de privacidad) siguen el mismo
criterio aunque no tengan mockup mobile explícito — son formularios de una
columna, se adaptan solas.

## Qué NO construir (fuera de alcance, a propósito)

- Ninguna llamada real a una API (ni al backend Changuito ni a ningún otro).
- Pasarela de pago real, cualquier campo de tarjeta/CBU real.
- Hasheo de contraseñas ni ninguna medida de seguridad real — es una
  simulación académica sin servidor, y debe quedar dicho en algún lugar
  visible.
- Persistencia real en servidor (localStorage sí está bien, y es la decisión
  tomada para carrito, usuarios y sesión).

## Forma de trabajo

Igual que con el backend: avanzar por pasos chicos, explicar brevemente qué
se va a hacer y por qué antes de cada paso, y esperar confirmación antes de
seguir al siguiente.

1. ~~Setup del proyecto + sistema de diseño~~ ✅ hecho
2. ~~Layouts, navegación y `AuthContext`/`CartContext`~~ ✅ hecho
3. ~~Login + registro + política de privacidad~~ ✅ hecho
4. ~~Catálogo + detalle + carrito~~ ✅ hecho
5. ~~Checkout + confirmación~~ ✅ hecho
6. Nosotros + Contacto
7. Administración completa, con sus rutas protegidas
8. Pulido de accesibilidad y responsive + revisión contra cada criterio de
   la rúbrica
9. **Guía de defensa** (`DEFENSA_FRONTEND.md`): igual que se hizo para el
   backend — las preguntas de la rúbrica y del material de la cátedra
   respondidas contra el código real, con el mapeo explícito de qué parte
   del código responde a cada uno de los 8 criterios de
   `Rubrica_Apis_Interactivas.pdf`. Se escribe al final, contra el código
   terminado, no antes.
