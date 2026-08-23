-- Linea de tiempo laboral - insumo principal de /trayectoria y /hire-me.
-- experiencia_logros es 1-N y ordenable (bullets de impacto).
CREATE TABLE experiencias (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa             VARCHAR(120)  NOT NULL,
  rol                 VARCHAR(120)  NOT NULL,
  modalidad           ENUM('remoto','presencial','hibrido','freelance') NOT NULL,
  fecha_inicio        DATE          NOT NULL,
  fecha_fin           DATE          NULL,
  actual              TINYINT(1)    NOT NULL DEFAULT 0,
  resumen             VARCHAR(300)  NOT NULL,
  descripcion         MEDIUMTEXT    NOT NULL,
  ubicacion           VARCHAR(120)  NULL,
  destacado           TINYINT(1)    NOT NULL DEFAULT 0,
  visible             TINYINT(1)    NOT NULL DEFAULT 1,
  orden               INT           NOT NULL DEFAULT 0,
  estado_publicacion  ENUM('borrador','publicado') NOT NULL DEFAULT 'borrador',
  creado_en           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  eliminado_en        DATETIME      NULL,
  CHECK (actual = 0 OR fecha_fin IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE experiencia_logros (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  experiencia_id INT UNSIGNED NOT NULL,
  texto          VARCHAR(300) NOT NULL,
  orden          INT          NOT NULL DEFAULT 0,
  FOREIGN KEY fk_experiencia_logros_experiencia (experiencia_id) REFERENCES experiencias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
