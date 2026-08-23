-- Resultados como lista estructurada {metrica, valor, descripcion} en vez
-- de texto libre, para que el frontend renderice "stat cards"
-- automaticamente sin diseno manual por proyecto.
CREATE TABLE proyecto_resultados (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proyecto_id  INT UNSIGNED NOT NULL,
  metrica      VARCHAR(120) NOT NULL,
  valor        VARCHAR(60)  NOT NULL,
  descripcion  VARCHAR(200) NULL,
  orden        INT          NOT NULL DEFAULT 0,
  FOREIGN KEY fk_proyecto_resultados_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
