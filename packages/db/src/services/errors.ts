/**
 * Error de regla de negocio (no de infraestructura). La capa de API
 * (Iteración 2/3) lo captura para devolver 400 con `mensaje`, en vez de
 * un 500 genérico.
 */
export class ValidationError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ValidationError";
  }
}
