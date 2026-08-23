CREATE TABLE experiencia_proyecto (
  experiencia_id  INT UNSIGNED NOT NULL,
  proyecto_id     INT UNSIGNED NOT NULL,
  PRIMARY KEY (experiencia_id, proyecto_id),
  FOREIGN KEY fk_experiencia_proyecto_experiencia (experiencia_id) REFERENCES experiencias(id) ON DELETE CASCADE,
  FOREIGN KEY fk_experiencia_proyecto_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
