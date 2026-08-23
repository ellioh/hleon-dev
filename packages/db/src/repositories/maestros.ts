import type { Categoria, Certificacion, Cliente, Educacion, Enlace, Faq, Habilidad, Media, Tecnologia, Usuario } from "@hleon/types";
import { BaseRepository } from "./BaseRepository.js";

/**
 * Repositorios de módulos "maestro" - sin reglas de negocio propias más
 * allá del CRUD, por eso se exponen como instancias directas de
 * BaseRepository en vez de una subclase por archivo (evita boilerplate
 * repetido para 9 módulos casi idénticos).
 */

export const categoriaRepository = new BaseRepository<Categoria>("categorias", [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "slug", db: "slug" },
  { ts: "tipo", db: "tipo" },
  { ts: "descripcion", db: "descripcion" },
  { ts: "orden", db: "orden" },
]);

export const tecnologiaRepository = new BaseRepository<Tecnologia>("tecnologias", [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "categoria", db: "categoria" },
  { ts: "icono", db: "icono" },
  { ts: "colorAcento", db: "color_acento" },
  { ts: "url", db: "url" },
  { ts: "destacado", db: "destacado" },
  { ts: "orden", db: "orden" },
]);

export const clienteRepository = new BaseRepository<Cliente>("clientes", [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "logoMediaId", db: "logo_media_id" },
  { ts: "url", db: "url" },
  { ts: "rubro", db: "rubro" },
  { ts: "destacado", db: "destacado" },
  { ts: "orden", db: "orden" },
]);

export const habilidadRepository = new BaseRepository<Habilidad>("habilidades", [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "categoria", db: "categoria" },
  { ts: "descripcionBreve", db: "descripcion_breve" },
  { ts: "nivelInterno", db: "nivel_interno" },
  { ts: "destacada", db: "destacada" },
  { ts: "orden", db: "orden" },
]);

export const faqRepository = new BaseRepository<Faq>("faqs", [
  { ts: "id", db: "id" },
  { ts: "pregunta", db: "pregunta" },
  { ts: "respuesta", db: "respuesta" },
  { ts: "seccion", db: "seccion" },
  { ts: "visible", db: "visible" },
  { ts: "orden", db: "orden" },
]);

export const enlaceRepository = new BaseRepository<Enlace>("enlaces", [
  { ts: "id", db: "id" },
  { ts: "etiqueta", db: "etiqueta" },
  { ts: "url", db: "url" },
  { ts: "contexto", db: "contexto" },
  { ts: "orden", db: "orden" },
  { ts: "visible", db: "visible" },
  { ts: "abreNuevaPestana", db: "abre_nueva_pestana" },
]);

export const educacionRepository = new BaseRepository<Educacion>(
  "educaciones",
  [
    { ts: "id", db: "id" },
    { ts: "institucion", db: "institucion" },
    { ts: "titulo", db: "titulo" },
    { ts: "campoEstudio", db: "campo_estudio" },
    { ts: "fechaInicio", db: "fecha_inicio" },
    { ts: "fechaFin", db: "fecha_fin" },
    { ts: "enCurso", db: "en_curso" },
    { ts: "descripcion", db: "descripcion" },
    { ts: "visible", db: "visible" },
    { ts: "orden", db: "orden" },
    { ts: "creadoEn", db: "creado_en" },
    { ts: "eliminadoEn", db: "eliminado_en" },
  ],
  { softDelete: true }
);

export const certificacionRepository = new BaseRepository<Certificacion>(
  "certificaciones",
  [
    { ts: "id", db: "id" },
    { ts: "nombre", db: "nombre" },
    { ts: "emisor", db: "emisor" },
    { ts: "fechaObtencion", db: "fecha_obtencion" },
    { ts: "fechaExpiracion", db: "fecha_expiracion" },
    { ts: "credencialId", db: "credencial_id" },
    { ts: "urlVerificacion", db: "url_verificacion" },
    { ts: "imagenInsigniaId", db: "imagen_insignia_id" },
    { ts: "destacado", db: "destacado" },
    { ts: "visible", db: "visible" },
    { ts: "orden", db: "orden" },
    { ts: "creadoEn", db: "creado_en" },
    { ts: "eliminadoEn", db: "eliminado_en" },
  ],
  { softDelete: true }
);

export const mediaRepository = new BaseRepository<Media>("media", [
  { ts: "id", db: "id" },
  { ts: "url", db: "url" },
  { ts: "tipo", db: "tipo" },
  { ts: "altText", db: "alt_text" },
  { ts: "tamanoBytes", db: "tamano_bytes" },
  { ts: "ancho", db: "ancho" },
  { ts: "alto", db: "alto" },
  { ts: "subidoPor", db: "subido_por" },
  { ts: "subidoEn", db: "subido_en" },
]);

/**
 * Usuario expone `passwordHash` porque vive en el mismo repositorio que
 * lee/escribe la fila completa - es responsabilidad de `packages/auth`
 * (no de aquí) nunca serializar ese campo hacia una respuesta HTTP.
 */
export const usuarioRepository = new BaseRepository<Usuario>("usuarios", [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "email", db: "email" },
  { ts: "passwordHash", db: "password_hash" },
  { ts: "rol", db: "rol" },
  { ts: "activo", db: "activo" },
  { ts: "ultimoAcceso", db: "ultimo_acceso" },
  { ts: "creadoEn", db: "creado_en" },
]);
