-- Auto-relacion no dirigida entre proyectos. Se guarda una sola fila por
-- par (proyecto_id < relacionado_id) y el repositorio consulta en ambos
-- sentidos, para no duplicar el mismo vinculo dos veces.
CREATE TABLE proyecto_relacionado (
  proyecto_id     INT UNSIGNED NOT NULL,
  relacionado_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (proyecto_id, relacionado_id),
  FOREIGN KEY fk_proyecto_relacionado_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY fk_proyecto_relacionado_relacionado (relacionado_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  CHECK (proyecto_id < relacionado_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
