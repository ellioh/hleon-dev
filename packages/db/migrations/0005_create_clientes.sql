-- Maestro ligero de empresas, referenciado por Proyecto y Testimonio para
-- evitar reescribir el mismo nombre de cliente con riesgo de inconsistencia.
CREATE TABLE clientes (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120)  NOT NULL,
  logo_media_id  INT UNSIGNED  NULL,
  url            VARCHAR(255)  NULL,
  rubro          VARCHAR(80)   NULL,
  destacado      TINYINT(1)    NOT NULL DEFAULT 0,
  orden          INT           NOT NULL DEFAULT 0,
  creado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_clientes_logo (logo_media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
