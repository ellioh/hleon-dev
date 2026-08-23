-- Versiones de CV descargables (ES/EN, por version). Soporta el requisito
-- de escalabilidad "descarga de multiples CV" sin tocar codigo.
CREATE TABLE descargas (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(120)  NOT NULL,
  idioma              ENUM('es','en') NOT NULL,
  archivo_media_id    INT UNSIGNED  NOT NULL,
  version             VARCHAR(20)   NOT NULL,
  es_predeterminado   TINYINT(1)    NOT NULL DEFAULT 0,
  visible             TINYINT(1)    NOT NULL DEFAULT 1,
  descargas_contador  INT UNSIGNED  NOT NULL DEFAULT 0,
  creado_en           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY fk_descargas_media (archivo_media_id) REFERENCES media(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Regla de negocio "un solo predeterminado por idioma" se aplica en
-- DescargaService (packages/db/src/services), no en la base de datos:
-- un indice unico condicional no es portable en MySQL 8 sin columnas
-- generadas adicionales, y hubiera anadido complejidad sin necesidad.
