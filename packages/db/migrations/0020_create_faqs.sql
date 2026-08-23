CREATE TABLE faqs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pregunta   VARCHAR(200) NOT NULL,
  respuesta  MEDIUMTEXT   NOT NULL,
  seccion    ENUM('servicios','general','proceso','reclutamiento') NOT NULL,
  visible    TINYINT(1)   NOT NULL DEFAULT 1,
  orden      INT          NOT NULL DEFAULT 0,
  creado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
