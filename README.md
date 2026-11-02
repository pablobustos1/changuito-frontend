# Changuito — Frontend (Etapa 2)

Interfaz de un almacén de barrio con venta online: catálogo, carrito, compra
simulada, inicio de sesión/registro, y un área de administración de
productos. Es **solo frontend**: no se conecta a ningún backend, todos los
datos viven en memoria y en `localStorage` del navegador.

| | |
|---|---|
| Framework | React 19 + Vite |
| Rutas | react-router-dom |
| Estilos | CSS plano por componente + tokens globales en `src/index.css` |
| Datos | Simulados (`src/data/`, `src/services/`), sin conexión a ningún servidor |

## Documentos de referencia

| Archivo | Contenido |
|---|---|
| `PLAN_FRONTEND.md` | El plan completo: decisiones técnicas, desviaciones del prototipo (y por qué), estructura de carpetas, reglas de negocio y validaciones |
| `docs/prototipo/` | El prototipo de diseño aprobado (Claude Design). Fuente de verdad visual y de contenido |
| `docs/Rubrica_Apis_Interactivas.pdf` | La rúbrica de evaluación de la cátedra |
| `docs/Frontend_con_React.pdf` | El material de la cátedra sobre React |

## Puesta en marcha

```bash
npm install
npm run dev
```

Queda escuchando en `http://localhost:5173`.

```bash
npm run build     # build de producción en dist/
npm run preview   # sirve ese build, para probarlo como quedaría publicado
npm run lint       # oxlint
```

## Estado

Etapa 2 en desarrollo. El avance está registrado en `PLAN_FRONTEND.md`.
