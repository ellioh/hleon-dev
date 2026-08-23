-- Competencias de analista (deliberadamente distinto de "tecnologias" -
-- ver documento de diseno funcional del CMS, modulo Habilidades).
CREATE TABLE habilidades (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre             VARCHAR(120) NOT NULL,
  categoria          ENUM('analisis_arquitectura','liderazgo_comunicacion','backend','frontend','datos','herramientas','idiomas') NOT NULL,
  descripcion_breve  VARCHAR(200) NULL,
  nivel_interno      TINYINT UNSIGNED NULL COMMENT 'Solo para ordenar internamente, nunca se renderiza como barra publica',
  destacada          TINYINT(1)   NOT NULL DEFAULT 0,
  orden              INT          NOT NULL DEFAULT 0,
  creado_en          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
