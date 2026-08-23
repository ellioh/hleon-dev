CREATE TABLE experiencia_tecnologia (
  experiencia_id  INT UNSIGNED NOT NULL,
  tecnologia_id   INT UNSIGNED NOT NULL,
  PRIMARY KEY (experiencia_id, tecnologia_id),
  FOREIGN KEY fk_experiencia_tecnologia_experiencia (experiencia_id) REFERENCES experiencias(id) ON DELETE CASCADE,
  FOREIGN KEY fk_experiencia_tecnologia_tecnologia (tecnologia_id) REFERENCES tecnologias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
