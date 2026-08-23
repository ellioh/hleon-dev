-- Usuarios del backoffice. Hoy solo existe un administrador, pero se modela
-- con rol desde el inicio para no requerir una migración de auth futura
-- (ver ADR pendiente: "single-user CMS user model").
CREATE TABLE usuarios (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120)    NOT NULL,
  email          VARCHAR(190)    NOT NULL,
  password_hash  VARCHAR(255)    NOT NULL,
  rol            ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  activo         TINYINT(1)      NOT NULL DEFAULT 1,
  ultimo_acceso  DATETIME        NULL,
  creado_en      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
