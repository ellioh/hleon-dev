-- Enlaces de nav/footer/redes sociales. Alcance deliberadamente limitado:
-- gestiona QUE enlaces existentes se muestran, no crea paginas nuevas.
CREATE TABLE enlaces (
  id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  etiqueta             VARCHAR(60)  NOT NULL,
  url                  VARCHAR(255) NOT NULL,
  contexto             ENUM('social','nav_principal','footer') NOT NULL,
  orden                INT          NOT NULL DEFAULT 0,
  visible              TINYINT(1)   NOT NULL DEFAULT 1,
  abre_nueva_pestana   TINYINT(1)   NOT NULL DEFAULT 0,
  creado_en            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
