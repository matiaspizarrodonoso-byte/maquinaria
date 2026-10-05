-- Endurecer el bucket de imágenes: antes cualquier usuario autenticado podía
-- subir CUALQUIER tipo y tamaño de archivo a un bucket público (riesgo de
-- HTML/SVG malicioso servido desde el dominio de Supabase, o de abuso de
-- espacio). Ahora: solo imágenes comunes y hasta 5 MB por archivo.
-- El formulario del admin valida lo mismo del lado cliente (mejor UX);
-- esta restricción es la que realmente se aplica en servidor.

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  file_size_limit = 5242880 -- 5 MB
WHERE id = 'productos';
