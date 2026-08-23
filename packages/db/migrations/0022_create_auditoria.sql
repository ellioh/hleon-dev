-- Bitacora de cambios, solo lectura desde la aplicacion (nunca se
-- inserta/edita manualmente desde el backoffice). Candidata a archivado
-- despues de 2 anos - ver documento de diseno del CMS, seccion 5.
CREATE TABLE auditoria (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  modulo      VARCHAR(60)  NOT NULL,
  entidad_id  INT UNSIGNED NOT NULL,
  accion      ENUM('crear','editar','eliminar','publicar','despublicar') NOT NULL,
  usuario_id  INT UNSIGNED NOT NULL,
  cambios     JSON         NULL,
  fecha       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_auditoria_usuario (usuario_id) REFERENCES usuarios(id),
  KEY idx_auditoria_modulo (modulo, entidad_id),
  KEY idx_auditoria_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
