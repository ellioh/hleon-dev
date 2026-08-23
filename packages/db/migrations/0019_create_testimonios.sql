-- Regla de negocio critica (hallazgo de la auditoria tecnica: testimonios
-- no verificables): no se puede marcar publicado=1 sin
-- consentimiento_verificado=1. Se aplica aqui a nivel de base de datos
-- (defensa en profundidad) Y en TestimonioService (mensaje de error legible).
CREATE TABLE testimonios (
  id                        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente            VARCHAR(120)  NOT NULL,
  rol_cliente                VARCHAR(120)  NOT NULL,
  cliente_id                INT UNSIGNED  NULL,
  texto                     VARCHAR(500)  NOT NULL,
  calificacion              TINYINT UNSIGNED NULL,
  proyecto_id               INT UNSIGNED  NULL,
  consentimiento_verificado TINYINT(1)    NOT NULL DEFAULT 0,
  publicado                 TINYINT(1)    NOT NULL DEFAULT 0,
  destacado                 TINYINT(1)    NOT NULL DEFAULT 0,
  orden                     INT           NOT NULL DEFAULT 0,
  fecha_recibido             DATE          NULL,
  creado_en                 DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminado_en               DATETIME      NULL,
  FOREIGN KEY fk_testimonios_cliente (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY fk_testimonios_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE SET NULL,
  CHECK (calificacion IS NULL OR calificacion BETWEEN 1 AND 5),
  CHECK (publicado = 0 OR consentimiento_verificado = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
