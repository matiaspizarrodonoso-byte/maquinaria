-- ============================================================================
-- Forja — Esquema de base de datos (Supabase / Postgres)
-- ============================================================================
-- Cómo aplicar: Supabase Dashboard → SQL Editor → pegar este archivo completo
-- → Run. Es idempotente (se puede correr más de una vez sin romper nada).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tablas
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS productos (
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

CREATE TABLE IF NOT EXISTS producto_imagenes (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  orden INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_producto_imagenes_producto
  ON producto_imagenes (producto_id, orden);

CREATE INDEX IF NOT EXISTS idx_productos_activo
  ON productos (activo);

-- NOTA (decisión de diseño): la columna `url` guarda la URL pública completa
-- del objeto en Storage. El path interno del objeto en el bucket NO se guarda
-- como columna separada: se extrae de la URL al borrar
-- (todo lo que sigue a .../object/public/productos/).
-- Si en el futuro se migra a bucket privado (signed URLs), a un CDN propio o a
-- image transformations, conviene agregar una columna `path` y guardar ambos.

-- ----------------------------------------------------------------------------
-- Regla de negocio: máximo 3 imágenes por producto (validación en DB)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION limitar_imagenes_producto()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM producto_imagenes WHERE producto_id = NEW.producto_id) >= 3 THEN
    RAISE EXCEPTION 'Un producto puede tener como máximo 3 imágenes';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_limitar_imagenes ON producto_imagenes;
CREATE TRIGGER trg_limitar_imagenes
  BEFORE INSERT ON producto_imagenes
  FOR EACH ROW
  EXECUTE FUNCTION limitar_imagenes_producto();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
-- NOTA (roles futuros): las políticas de escritura otorgan gestión TOTAL a
-- cualquier usuario autenticado (to authenticated using (true)). Hoy está bien
-- porque hay un solo admin. Si mañana se agregan empleados o permisos
-- limitados, crear una tabla de perfiles/roles (ej. profiles con columna rol)
-- y reemplazar estas políticas por otras que verifiquen el rol.
-- ----------------------------------------------------------------------------

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;

-- Lectura pública (visitantes anon): solo productos activos
DROP POLICY IF EXISTS "lectura publica productos activos" ON productos;
CREATE POLICY "lectura publica productos activos"
  ON productos FOR SELECT
  TO anon
  USING (activo = 1);

-- Lectura admin (authenticated): todos los productos, activos e inactivos.
-- Sin esto, UPDATE ... RETURNING falla al pasar activo 1→0 (la fila nueva
-- también debe pasar la política de SELECT) y el dashboard esconde inactivos.
DROP POLICY IF EXISTS "admin lee productos" ON productos;
CREATE POLICY "admin lee productos"
  ON productos FOR SELECT
  TO authenticated
  USING (true);

-- Lectura pública (visitantes anon): solo imágenes de productos activos
DROP POLICY IF EXISTS "lectura publica imagenes de activos" ON producto_imagenes;
CREATE POLICY "lectura publica imagenes de activos"
  ON producto_imagenes FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM productos p
      WHERE p.id = producto_imagenes.producto_id
        AND p.activo = 1
    )
  );

-- Lectura admin (authenticated): todas las imágenes.
DROP POLICY IF EXISTS "admin lee imagenes" ON producto_imagenes;
CREATE POLICY "admin lee imagenes"
  ON producto_imagenes FOR SELECT
  TO authenticated
  USING (true);

-- Escritura: solo usuarios autenticados (admin)
DROP POLICY IF EXISTS "admin inserta productos" ON productos;
CREATE POLICY "admin inserta productos"
  ON productos FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin actualiza productos" ON productos;
CREATE POLICY "admin actualiza productos"
  ON productos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin borra productos" ON productos;
CREATE POLICY "admin borra productos"
  ON productos FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin inserta imagenes" ON producto_imagenes;
CREATE POLICY "admin inserta imagenes"
  ON producto_imagenes FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin actualiza imagenes" ON producto_imagenes;
CREATE POLICY "admin actualiza imagenes"
  ON producto_imagenes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin borra imagenes" ON producto_imagenes;
CREATE POLICY "admin borra imagenes"
  ON producto_imagenes FOR DELETE
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- Permisos API (GRANTs a roles anon / authenticated / service_role)
-- ----------------------------------------------------------------------------
-- Necesario en Supabase (nuevo default: las tablas nuevas NO se auto-exponen
-- a los roles de API). RLS controla QUÉ filas puede leer/escribir cada rol;
-- los GRANT controlan QUÉ operaciones puede hacer el rol sobre la tabla.
-- Sin GRANT, la política RLS nunca llega a evaluarse (PostgREST devuelve
-- "permission denied for table ..."). Idempotente: re-ejecutar no rompe nada.

GRANT SELECT ON productos TO anon, authenticated;
GRANT SELECT ON producto_imagenes TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON productos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON producto_imagenes TO authenticated;

-- service_role opera con la service key (solo servidor, setup/seed, bypassa RLS).
GRANT SELECT, INSERT, UPDATE, DELETE ON productos TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON producto_imagenes TO service_role;

-- Secuencias SERIAL: necesarias para INSERT (nextval del id autogenerado).
GRANT USAGE, SELECT ON SEQUENCE productos_id_seq TO authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE producto_imagenes_id_seq TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- Storage: bucket público para imágenes de productos
-- ----------------------------------------------------------------------------
-- NOTA (borrado): el ON DELETE CASCADE de producto_imagenes borra las FILAS
-- de la tabla, pero NO los archivos del bucket. La lógica de borrado de
-- archivos la hace el route handler del admin: primero borra los objetos de
-- Storage (parseando el path desde la url) y después borra el producto.
-- ----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

-- Endurecimiento (migración 20260928120000): solo imágenes y máx. 5 MB por
-- archivo. Es un UPDATE aparte para que sea idempotente sobre buckets ya
-- creados con el INSERT de arriba.
UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  file_size_limit = 5242880 -- 5 MB
WHERE id = 'productos';

-- Lectura pública de los objetos del bucket (la landing las sirve sin auth)
DROP POLICY IF EXISTS "lectura publica bucket productos" ON storage.objects;
CREATE POLICY "lectura publica bucket productos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'productos');

-- Subida y borrado solo para usuarios autenticados (admin)
DROP POLICY IF EXISTS "admin sube imagenes" ON storage.objects;
CREATE POLICY "admin sube imagenes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'productos');

DROP POLICY IF EXISTS "admin borra imagenes storage" ON storage.objects;
CREATE POLICY "admin borra imagenes storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'productos');

DROP POLICY IF EXISTS "admin actualiza imagenes storage" ON storage.objects;
CREATE POLICY "admin actualiza imagenes storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'productos');
