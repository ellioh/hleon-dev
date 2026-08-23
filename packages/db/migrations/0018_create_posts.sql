-- tipo_audiencia determina el CTA dinamico definido en la estrategia de
-- contenido (consultoria => "Solicitar evaluacion", carrera_arquitectura
-- => "Busco un Systems Analyst remoto"). autor referencia Perfil, no un
-- string fijo, para no romper nada si en el futuro hay coautoria.
CREATE TABLE posts (
  id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo               VARCHAR(180)  NOT NULL,
  slug                 VARCHAR(200)  NOT NULL,
  resumen              VARCHAR(300)  NOT NULL,
  contenido            MEDIUMTEXT    NOT NULL,
  categoria_id         INT UNSIGNED  NOT NULL,
  tipo_audiencia       ENUM('consultoria','carrera_arquitectura','ambos') NOT NULL DEFAULT 'ambos',
  tags                 JSON          NULL,
  meta_descripcion     VARCHAR(160)  NOT NULL,
  imagen_destacada_id  INT UNSIGNED  NULL,
  autor_id             INT UNSIGNED  NOT NULL,
  publicado            TINYINT(1)    NOT NULL DEFAULT 0,
  fecha_publicacion    DATETIME      NOT NULL,
  fecha_actualizacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  creado_en            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminado_en         DATETIME      NULL,
  FOREIGN KEY fk_posts_categoria (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY fk_posts_media (imagen_destacada_id) REFERENCES media(id) ON DELETE SET NULL,
  FOREIGN KEY fk_posts_autor (autor_id) REFERENCES perfil(id),
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_publicado (publicado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
