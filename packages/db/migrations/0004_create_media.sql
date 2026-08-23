-- Biblioteca unica de archivos (imagenes, PDFs). Evita subir el mismo
-- archivo dos veces y permite saber que se puede borrar con seguridad
-- (columna calculada usado_en se resuelve en el repositorio, no aqui).
CREATE TABLE media (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  url            VARCHAR(500)  NOT NULL,
  tipo           ENUM('imagen','pdf','video_embed') NOT NULL,
  alt_text       VARCHAR(200)  NULL,
  tamano_bytes   INT UNSIGNED  NULL,
  ancho          INT UNSIGNED  NULL,
  alto           INT UNSIGNED  NULL,
  subido_por     INT UNSIGNED  NULL,
  subido_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_media_usuario (subido_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
