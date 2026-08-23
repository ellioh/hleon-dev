-- Singleton: SEO global y feature flags de sitio completo. Los campos SEO
-- de contenido (meta_titulo, meta_descripcion, og_image) viven embebidos
-- en cada modulo de contenido (proyectos, posts, servicios) - ver ADR
-- "SEO embebido vs tabla SEO monolitica" pendiente de redactar en /docs/adr.
CREATE TABLE configuracion (
  id                        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_sitio              VARCHAR(80)   NOT NULL,
  titulo_template           VARCHAR(80)   NOT NULL,
  descripcion_default       VARCHAR(200)  NOT NULL,
  imagen_og_default_id      INT UNSIGNED  NULL,
  dominio_base              VARCHAR(120)  NOT NULL,
  analytics_id              VARCHAR(60)   NULL,
  google_search_console     VARCHAR(120)  NULL,
  textos_legales            MEDIUMTEXT    NULL,
  feature_flags             JSON          NULL,
  creado_en                 DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY fk_configuracion_og (imagen_og_default_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
