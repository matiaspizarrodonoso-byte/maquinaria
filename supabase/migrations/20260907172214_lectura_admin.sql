-- Fix: la lectura del admin no debe estar limitada a activo = 1.
-- Causa del bug: UPDATE ... RETURNING exige que la fila nueva pase la
-- política de SELECT; con la política pública compartida (anon,authenticated)
-- no se podía pasar activo 1→0 ("new row violates row-level security policy").
-- Además el dashboard escondía los productos inactivos.

DROP POLICY IF EXISTS "lectura publica productos activos" ON productos;
CREATE POLICY "lectura publica productos activos"
  ON productos FOR SELECT
  TO anon
  USING (activo = 1);

DROP POLICY IF EXISTS "admin lee productos" ON productos;
CREATE POLICY "admin lee productos"
  ON productos FOR SELECT
  TO authenticated
  USING (true);

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

DROP POLICY IF EXISTS "admin lee imagenes" ON producto_imagenes;
CREATE POLICY "admin lee imagenes"
  ON producto_imagenes FOR SELECT
  TO authenticated
  USING (true);
