-- Leads del formulario de contacto, con branching por motivo (estrategia
-- de contenido: "proyecto" vs "empleo"). estado reemplaza el booleano
-- "leido" del sistema anterior por un pipeline real de seguimiento.
CREATE TABLE solicitudes (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  motivo                ENUM('proyecto','empleo','otro') NOT NULL,
  nombre                VARCHAR(120)  NOT NULL,
  email                 VARCHAR(190)  NOT NULL,
  mensaje               TEXT          NOT NULL,
  empresa               VARCHAR(120)  NULL,
  tipo_sistema_id        INT UNSIGNED  NULL,
  presupuesto            VARCHAR(60)   NULL,
  empresa_reclutadora    VARCHAR(120)  NULL,
  tipo_rol               VARCHAR(120)  NULL,
  modalidad              ENUM('remoto','hibrido','presencial') NULL,
  rango_salarial         VARCHAR(80)   NULL,
  url_vacante            VARCHAR(255)  NULL,
  estado                 ENUM('nuevo','leido','respondido','archivado') NOT NULL DEFAULT 'nuevo',
  notas_internas         TEXT          NULL,
  origen                 VARCHAR(160)  NULL,
  fecha                  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminado_en            DATETIME      NULL,
  FOREIGN KEY fk_solicitudes_categoria (tipo_sistema_id) REFERENCES categorias(id) ON DELETE SET NULL,
  KEY idx_solicitudes_motivo_estado (motivo, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
