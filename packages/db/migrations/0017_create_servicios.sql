CREATE TABLE servicios (
  id                     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre                 VARCHAR(120)  NOT NULL,
  slug                   VARCHAR(140)  NOT NULL,
  icono_emoji            VARCHAR(10)   NULL,
  resumen_breve          VARCHAR(150)  NOT NULL,
  descripcion_completa   MEDIUMTEXT    NOT NULL,
  rango_precio_min       DECIMAL(10,2) NULL,
  rango_precio_max       DECIMAL(10,2) NULL,
  moneda                 ENUM('USD','PEN') NULL,
  tiempo_estimado        VARCHAR(60)   NULL,
  proyecto_ejemplo_id    INT UNSIGNED  NULL,
  categoria_id           INT UNSIGNED  NOT NULL,
  visible                TINYINT(1)    NOT NULL DEFAULT 1,
  destacado              TINYINT(1)    NOT NULL DEFAULT 0,
  orden                  INT           NOT NULL DEFAULT 0,
  creado_en              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  eliminado_en           DATETIME      NULL,
  FOREIGN KEY fk_servicios_proyecto (proyecto_ejemplo_id) REFERENCES proyectos(id) ON DELETE SET NULL,
  FOREIGN KEY fk_servicios_categoria (categoria_id) REFERENCES categorias(id),
  UNIQUE KEY uq_servicios_slug (slug),
  CHECK (rango_precio_max IS NULL OR rango_precio_min IS NULL OR rango_precio_max >= rango_precio_min)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE servicio_entregables (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  servicio_id  INT UNSIGNED NOT NULL,
  texto        VARCHAR(200) NOT NULL,
  orden        INT          NOT NULL DEFAULT 0,
  FOREIGN KEY fk_servicio_entregables_servicio (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
