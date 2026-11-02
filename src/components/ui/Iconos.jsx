/**
 * Set de íconos propios de Changuito: trazo de 24px, línea de 1,75px, puntas
 * redondeadas, sin relleno — la regla de Identidad-Componentes.dc.html. Son
 * los únicos ocho que usa la app, nada de librerías externas.
 *
 * Decorativos por defecto (aria-hidden, focusable="false"): cuando un botón
 * lleva solo ícono, el texto accesible va en el propio botón (aria-label),
 * nunca acá.
 */
const basePropiedades = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

export function IconoCarrito(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}

export function IconoBuscar(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}

export function IconoModificar(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="M14 7l3 3" />
    </svg>
  );
}

export function IconoEliminar(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function IconoConfirmar(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function IconoCorreo(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5l8.5 7 8.5-7" />
    </svg>
  );
}

export function IconoAlmacen(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M4 10l1.3-5h13.4L20 10" />
      <path d="M4 10h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function IconoAviso(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Los dos siguientes no estaban en la lista original de Identidad-Componentes
 * — ahí no se había diseñado todavía el menú de navegación en mobile. Hacen
 * falta para el botón que abre/cierra ese menú, mismo trazo que el resto. */
export function IconoMenu(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function IconoCerrar(props) {
  return (
    <svg {...basePropiedades} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}
