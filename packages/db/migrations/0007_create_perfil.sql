-- Singleton: fuente unica de identidad, contacto y disponibilidad.
-- La fila unica (id=1) se garantiza a nivel de aplicacion (PerfilService),
-- no con un CHECK, para no acoplar la migracion a una convencion fragil.
CREATE TABLE perfil (
  id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_completo         VARCHAR(160)  NOT NULL,
  nombre_publico          VARCHAR(160)  NULL,
  titulo_profesional      VARCHAR(160)  NOT NULL,
  bio_corta               VARCHAR(200)  NOT NULL,
  bio_larga               MEDIUMTEXT    NOT NULL,
  foto_media_id           INT UNSIGNED  NULL,
  email                   VARCHAR(190)  NOT NULL,
  ubicacion               VARCHAR(120)  NOT NULL,
  nivel_ingles            ENUM('basico','intermedio','avanzado','profesional','nativo') NOT NULL,
  disponibilidad          ENUM('abierto_remoto','abierto_proyectos','abierto_ambos','no_disponible') NOT NULL,
  mensaje_disponibilidad  VARCHAR(200)  NULL,
  anos_experiencia        TINYINT UNSIGNED NOT NULL,
  cv_general_id           INT UNSIGNED  NULL,
  creado_en               DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY fk_perfil_foto (foto_media_id) REFERENCES media(id) ON DELETE SET NULL,
  FOREIGN KEY fk_perfil_cv (cv_general_id) REFERENCES descargas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
