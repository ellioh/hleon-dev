-- Taxonomia unica compartida por Blog, Proyectos y Servicios.
-- Reemplaza las dos listas de categoria divergentes que existian en el
-- sistema de archivos JSON (hallazgo de la auditoria tecnica).
CREATE TABLE categorias (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(80)   NOT NULL,
  slug            VARCHAR(90)   NOT NULL,
  tipo            ENUM('blog','proyecto','servicio','ambos') NOT NULL,
  descripcion     TEXT          NULL,
  orden           INT           NOT NULL DEFAULT 0,
  creado_en       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categorias_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
