-- El case study completo - modulo mas complejo del CMS. Los campos de
-- narrativa (el_desafio/la_solucion/mi_rol) son obligatorios porque el
-- formulario mismo debe ensenar la estructura editorial correcta
-- (ver documento de diseno funcional del CMS, seccion "modelo de contenido").
CREATE TABLE proyectos (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(160)  NOT NULL,
  slug                VARCHAR(180)  NOT NULL,
  resumen_ejecutivo   VARCHAR(220)  NOT NULL,
  cliente_id          INT UNSIGNED  NULL,
  es_confidencial     TINYINT(1)    NOT NULL DEFAULT 0,
  categoria_id        INT UNSIGNED  NOT NULL,
  estado              ENUM('en_curso','completado','mantenimiento','archivado') NOT NULL,
  modalidad           ENUM('remoto','presencial','hibrido') NOT NULL,
  fecha_inicio        DATE          NOT NULL,
  fecha_fin           DATE          NULL,
  el_desafio          MEDIUMTEXT    NOT NULL,
  la_solucion         MEDIUMTEXT    NOT NULL,
  mi_rol              MEDIUMTEXT    NOT NULL,
  arquitectura        MEDIUMTEXT    NULL,
  retos               MEDIUMTEXT    NULL,
  aprendizajes        MEDIUMTEXT    NULL,
  imagen_principal_id INT UNSIGNED  NULL,
  destacado           TINYINT(1)    NOT NULL DEFAULT 0,
  orden               INT           NOT NULL DEFAULT 0,
  visible             TINYINT(1)    NOT NULL DEFAULT 1,
  estado_publicacion  ENUM('borrador','publicado') NOT NULL DEFAULT 'borrador',
  meta_titulo         VARCHAR(160)  NULL,
  meta_descripcion    VARCHAR(160)  NULL,
  creado_en           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  eliminado_en        DATETIME      NULL,
  FOREIGN KEY fk_proyectos_cliente (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY fk_proyectos_categoria (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY fk_proyectos_media (imagen_principal_id) REFERENCES media(id) ON DELETE SET NULL,
  UNIQUE KEY uq_proyectos_slug (slug),
  KEY idx_proyectos_destacado (destacado),
  KEY idx_proyectos_estado_publicacion (estado_publicacion),
  CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Galeria de medios del proyecto (1-N).
CREATE TABLE proyecto_galeria (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proyecto_id  INT UNSIGNED NOT NULL,
  media_id     INT UNSIGNED NOT NULL,
  orden        INT          NOT NULL DEFAULT 0,
  FOREIGN KEY fk_proyecto_galeria_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY fk_proyecto_galeria_media (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Videos embebidos (Loom/YouTube) del proyecto.
CREATE TABLE proyecto_videos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proyecto_id  INT UNSIGNED NOT NULL,
  url          VARCHAR(255) NOT NULL,
  titulo       VARCHAR(160) NULL,
  orden        INT          NOT NULL DEFAULT 0,
  FOREIGN KEY fk_proyecto_videos_proyecto (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
