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

## Lo que ya está hecho (paso 1 — andamiaje y sistema de diseño)

- Proyecto Vite + React scaffoldeado, `react-router-dom` instalado.
- `index.html`: lang="es-AR", fuentes de Google Fonts (Manrope + Source Sans
  3), favicon con `pulgar.png`.
- `src/index.css`: todos los tokens de color/tipografía/forma/espaciado del
  documento de identidad, reset base, tipografía global (h1/h2/h3 en
  Manrope color verde oscuro, cuerpo en Source Sans 3 color texto), clase
  `.contenedor` (ancho máximo 1200px) y un breakpoint a 768px.
- `src/assets/marca/`: las tres imágenes del personaje.
- `src/components/ui/Iconos.jsx`: los 8 íconos propios (carrito, buscar,
  modificar, eliminar, confirmar, correo, almacén, aviso), SVG a mano, 24px,
  trazo 1.75.
- `src/components/ui/Boton.jsx` (+ css): las 5 variantes (principal, acento,
  secundario, destructivo, enlace), usable como `<button>`, `<a href>` o
  `<Link to>`.
- `src/components/ui/CampoFormulario.jsx` (+ css): label + input/select/
  textarea + ayuda/error, con aria-describedby y aria-invalid.
- `src/components/ui/Etiqueta.jsx` (+ css): las 5 etiquetas de estado
  (disponible, sin-stock, oferta, guardado, desactivado).
- Verificado con `npm run build` y con una captura de pantalla real
  (desktop y mobile) contra el servidor de preview: coincide con la
  identidad visual del prototipo.
- `src/App.jsx` tiene una vista de control **provisoria** que muestra todo
  lo anterior junto — se reemplaza en el paso 2 por el enrutamiento real.

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
2. Layouts, navegación y `AuthContext`/`CartContext`
3. Login + registro + política de privacidad
4. Catálogo + detalle + carrito
5. Checkout + confirmación
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
