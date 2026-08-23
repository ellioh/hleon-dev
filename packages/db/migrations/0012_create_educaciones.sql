CREATE TABLE educaciones (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  institucion    VARCHAR(160)  NOT NULL,
  titulo         VARCHAR(160)  NOT NULL,
  campo_estudio  VARCHAR(120)  NULL,
  fecha_inicio   DATE          NOT NULL,
  fecha_fin      DATE          NULL,
  en_curso       TINYINT(1)    NOT NULL DEFAULT 0,
  descripcion    TEXT          NULL,
  visible        TINYINT(1)    NOT NULL DEFAULT 1,
  orden          INT           NOT NULL DEFAULT 0,
  creado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminado_en   DATETIME      NULL,
  CHECK (en_curso = 0 OR fecha_fin IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
