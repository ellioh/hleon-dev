-- Maestro de stack tecnico. Responde "con que construyes" (distinto de
-- habilidades, que responde "que sabes analizar/liderar" - ver documento
-- de diseno funcional del CMS, modulo Habilidades).
CREATE TABLE tecnologias (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(60)   NOT NULL,
  categoria     ENUM('backend','frontend','basededatos','infraestructura','lenguaje','herramienta','otro') NOT NULL,
  icono         VARCHAR(60)   NULL,
  color_acento  VARCHAR(20)   NULL,
  url           VARCHAR(255)  NULL,
  destacado     TINYINT(1)    NOT NULL DEFAULT 0,
  orden         INT           NOT NULL DEFAULT 0,
  creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tecnologias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
