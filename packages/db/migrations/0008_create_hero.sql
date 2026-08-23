-- Singleton: mensaje y fork del home. hero_estadisticas es 1-N y vive en
-- la misma migracion por ser parte indivisible de la misma funcionalidad.
CREATE TABLE hero (
  id                              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  headline                        VARCHAR(160)  NOT NULL,
  subheadline                     TEXT          NOT NULL,
  fork_empresa_titulo             VARCHAR(120)  NOT NULL,
  fork_empresa_descripcion        VARCHAR(240)  NOT NULL,
  fork_empresa_cta_label          VARCHAR(60)   NOT NULL,
  fork_empresa_cta_url            VARCHAR(255)  NOT NULL,
  fork_reclutador_titulo          VARCHAR(120)  NOT NULL,
  fork_reclutador_descripcion     VARCHAR(240)  NOT NULL,
  fork_reclutador_cta_label       VARCHAR(60)   NOT NULL,
  fork_reclutador_cta_url         VARCHAR(255)  NOT NULL,
  cta_final_titulo                VARCHAR(160)  NULL,
  cta_final_descripcion           TEXT          NULL,
  creado_en                       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en                  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE hero_estadisticas (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hero_id   INT UNSIGNED  NOT NULL,
  numero    VARCHAR(20)   NOT NULL,
  etiqueta  VARCHAR(80)   NOT NULL,
  orden     INT           NOT NULL DEFAULT 0,
  FOREIGN KEY fk_hero_estadisticas_hero (hero_id) REFERENCES hero(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
