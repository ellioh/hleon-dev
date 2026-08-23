CREATE TABLE proyecto_tecnologia (
  proyecto_id    INT UNSIGNED NOT NULL,
  tecnologia_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (proyecto_id, tecnologia_id),
  FOREIGN KEY fk_proyecto_tecnologia_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY fk_proyecto_tecnologia_tecnologia (tecnologia_id) REFERENCES tecnologias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
