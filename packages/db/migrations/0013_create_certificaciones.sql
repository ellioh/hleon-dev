CREATE TABLE certificaciones (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(160)  NOT NULL,
  emisor              VARCHAR(120)  NOT NULL,
  fecha_obtencion     DATE          NOT NULL,
  fecha_expiracion    DATE          NULL,
  credencial_id       VARCHAR(120)  NULL,
  url_verificacion    VARCHAR(255)  NULL,
  imagen_insignia_id  INT UNSIGNED  NULL,
  destacado           TINYINT(1)    NOT NULL DEFAULT 0,
  visible             TINYINT(1)    NOT NULL DEFAULT 1,
  orden               INT           NOT NULL DEFAULT 0,
  creado_en           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminado_en        DATETIME      NULL,
  FOREIGN KEY fk_certificaciones_media (imagen_insignia_id) REFERENCES media(id) ON DELETE SET NULL,
  CHECK (fecha_expiracion IS NULL OR fecha_expiracion > fecha_obtencion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
