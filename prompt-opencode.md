# Proyecto: Forja — Catálogo de maquinaria pesada con panel de admin

## Contexto del negocio
Sitio web para un cliente que vende/repara maquinaria pesada usada. Los visitantes
navegan un catálogo de equipos y contactan por WhatsApp (no hay carrito ni pagos
online). El cliente necesita un panel de administración simple para cargar,
editar y borrar productos (nombre, descripción, precio, categoría, specs, fotos)
sin tocar código.

## Stack
- Next.js (App Router) + TypeScript
- Supabase: Postgres (datos), Auth (login del admin), Storage (imágenes)
- Deploy: Railway
- Sin librería de estilos (Tailwind no incluido a propósito): ya existe un
  diseño visual hecho a mano en CSS plano que hay que preservar y adaptar,
  no reemplazar por un sistema de diseño genérico.

## Identidad visual (ya definida, no rediseñar)
- Paleta: charcoal (#1C2024), concrete (#EDEAE2), amber (#E8A33D), rust (#B5502E),
  steel (#4B5560), plate (#C9CFD3). Variables ya declaradas en :root.
- Tipografías: Oswald (headings, uppercase), IBM Plex Sans (cuerpo),
  IBM Plex Mono (labels técnicos, específicaciones, badges).
- Estética "industrial/blueprint": bordes rectos, radios pequeños (2-6px),
  separadores punteados estilo plano técnico, tarjetas de producto oscuras
  ("nameplate") con specs en grilla tipo ficha técnica.
- Ya tengo armados y funcionando:
  - `index.html` — landing pública completa (nav, hero, categorías, sección
    catálogo con placeholders de loading/empty/error, sección "por qué
    comprarnos", CTA de WhatsApp, footer).
  - `index.css` — todos los estilos de la landing pública.
  - `admin.css` — estilos para tabla, modal y formulario del panel admin
    (ya escritos, panel HTML/JS aún no armado).
- Adjunto estos 3 archivos como referencia de contexto — mantené las mismas
  clases y variables CSS, no inventes un sistema nuevo.

## Lo que YA está resuelto (no rehacer)
- Diseño visual completo de la landing pública.
- CSS del admin ya escrito (tabla `.table`, modal `.modal-content`,
  formulario `#producto-form` con `.form-group`, `.form-row`).
- Decisión de stack y de que NO hay carrito/pagos, solo contacto por WhatsApp
  (link tipo `https://wa.me/NUMERO?text=...`).

## Lo que falta construir
1. **Setup del proyecto Next.js** con TypeScript, conectado a Supabase
   (cliente en `/lib/supabase.ts`, variables de entorno `.env.local`).
2. **Esquema de base de datos en Supabase**:
   - Tabla `productos`, ya definida — usar exactamente este esquema, no
     modificarlo sin preguntar:
     ```sql
     CREATE TABLE productos (
       id SERIAL PRIMARY KEY,
       nombre TEXT NOT NULL,
       descripcion TEXT,
       precio NUMERIC,
       categoria TEXT,
       activo INTEGER DEFAULT 1,
       anio INTEGER,
       potencia TEXT,
       capacidad TEXT,
       alcance TEXT,
       creado_en TIMESTAMPTZ DEFAULT now()
     );
     ```
     Notas sobre este esquema:
     - `id` es SERIAL (entero autoincremental), no UUID — las rutas de
       producto usan el id numérico (ej. `/catalogo/12`), no un slug.
     - `activo` es INTEGER (1 = activo, 0 = inactivo), no boolean — respetar
       ese tipo en las queries y en el formulario del admin (select o
       checkbox que guarde 1/0).
     - `categoria` es TEXT libre, no FK a otra tabla — el filtro de
       categorías en el catálogo se arma con valores distintos existentes
       en esta columna (`SELECT DISTINCT categoria FROM productos`).
     - Specs técnicas son columnas propias, no un jsonb genérico: `anio`
       (año del equipo), `potencia` (ej. "150 HP"), `capacidad` (ej. "2.5 m³"),
       `alcance` (ej. "12 m", relevante para grúas). Son todas nullable
       porque no todas las categorías usan todas las specs (un generador
       no tiene "alcance", una grúa sí). El formulario del admin y la
       ficha de producto deben mostrar solo las specs que tengan valor,
       no filas vacías.
   - Tabla `producto_imagenes` para las fotos (hasta 3 por producto):
     ```sql
     CREATE TABLE producto_imagenes (
       id SERIAL PRIMARY KEY,
       producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
       url TEXT NOT NULL,
       orden INTEGER DEFAULT 0
     );
     ```
     `orden` define cuál imagen es la principal (0 = portada, se usa en la
     tarjeta `.nameplate` del catálogo; 0,1,2 se muestran las tres en la
     ficha individual del producto).
   - Row Level Security: lectura pública de productos con `activo = 1` (y
     de sus imágenes asociadas), escritura en ambas tablas solo para
     usuarios autenticados (admin).
   - Bucket de Supabase Storage para imágenes de productos, con política
     de subida solo para usuarios autenticados. Límite de 3 imágenes por
     producto validado tanto en el formulario del admin como con un
     trigger o constraint si es posible.
3. **Migrar el HTML estático a componentes de Next.js**:
   - Convertir `index.html` en `app/page.tsx` + componentes (`Header`,
     `Hero`, `Categorias`, `Catalogo`, `PorQue`, `CtaBand`, `Footer`),
     reusando las clases de `index.css` tal cual (importar como CSS global
     o module, a decidir).
   - El bloque `#productos-grid` debe traer productos reales desde Supabase
     (server component o fetch en cliente) y renderizar cada uno con la
     clase `.nameplate` como indica el comentario ya presente en el HTML.
     Cada tarjeta usa la imagen con `orden = 0` como portada, y muestra
     solo las specs (`anio`, `potencia`, `capacidad`, `alcance`) que el
     producto tenga cargadas, en `.spec-rows` / `.spec`.
   - Botón de WhatsApp en cada ficha de producto con mensaje pre-armado
     incluyendo el nombre del producto.
   - **Página individual de producto** — `app/catalogo/[id]/page.tsx`,
     nueva plantilla (no existe HTML de referencia todavía, hay que
     diseñarla manteniendo la estética "nameplate"/blueprint del resto
     del sitio). Debe incluir:
     - Las 3 imágenes del producto (`producto_imagenes` ordenadas por
       `orden`): una imagen principal grande + las otras dos como
       miniaturas clickeables que la reemplazan (galería simple, sin
       librería externa), o un carrusel liviano si el cliente sube menos
       de 3 fotos, mostrar solo las que existan sin huecos vacíos.
     - Nombre, descripción completa (sin recorte, a diferencia de la
       tarjeta del catálogo que sí trunca texto), precio si está cargado.
     - Ficha técnica con todas las specs disponibles (`anio`, `potencia`,
       `capacidad`, `alcance`) en formato tipo `.spec-rows` ampliado.
     - Botón de WhatsApp grande con mensaje pre-armado incluyendo nombre
       del producto (mismo patrón que en la tarjeta, pero más prominente).
     - Botón/link de "volver al catálogo".
     - Si `activo = 0` o el id no existe, mostrar 404 (no filtrar por
       activo si el admin entra a previsualizar — a definir si esa
       protección aplica solo a la vista pública).
4. **Panel de administración** (`/admin`):
   - `/admin/login` — login con Supabase Auth (email/password, un solo
     usuario por ahora).
   - `/admin` — dashboard con tabla de productos (usar clases `.table`,
     `.badge`/`.estado-badge` ya definidas en `admin.css`), acciones
     editar/eliminar.
   - `/admin/productos/nuevo` y `/admin/productos/[id]/editar` — formulario
     con `.form-group`/`.form-row` ya estilados, incluyendo subida de
     imágenes a Supabase Storage con preview.
   - Rutas de `/admin/*` protegidas: redirigir a login si no hay sesión.
5. **Descomentar el link al admin** en el nav de `index.html`/`Header.tsx`
   una vez que el panel esté listo para producción.

## Cómo quiero que avancemos
- Andá paso a paso: primero el setup + conexión a Supabase + esquema de
  base de datos, después la landing pública consumiendo datos reales,
  después el panel de admin.
- Preguntame antes de tomar decisiones de estructura de base de datos que
  no estén ya definidas arriba (por ejemplo si categorías es tabla propia
  o solo un campo de texto).
- No introduzcas Tailwind, Bootstrap, ni ningún framework de UI — seguimos
  con CSS plano usando los archivos ya provistos.
- Cada vez que termines una parte, decime qué falta configurar de mi lado
  (variables de entorno, crear el proyecto en Supabase, etc.) en pasos
  concretos.

Empecemos por el punto 1: setup del proyecto Next.js + conexión a Supabase.
