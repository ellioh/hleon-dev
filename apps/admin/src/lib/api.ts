/**
 * Cliente HTTP único del panel - resuelve auth por cookie (Sanctum SPA),
 * CSRF, y el formato de error consistente que expone la API
 * (`{message, errors?}`, ver ADR 0006). Todo hook/feature consume esto,
 * nunca `fetch` directo.
 */

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfReady: Promise<void> | null = null;

/** Sanctum exige la cookie XSRF-TOKEN antes de cualquier request que muta estado. */
async function ensureCsrfCookie(): Promise<void> {
  csrfReady ??= fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" }).then(() => undefined);
  return csrfReady;
}

/** Se limpia tras logout para forzar una cookie CSRF fresca en la siguiente sesión. */
export function resetCsrf(): void {
  csrfReady = null;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  const needsCsrf = method !== "GET";

  if (needsCsrf) {
    await ensureCsrfCookie();
  }

  const headers: Record<string, string> = { Accept: "application/json" };

  if (needsCsrf) {
    const token = getCookie("XSRF-TOKEN");
    if (token) headers["X-XSRF-TOKEN"] = token;
  }

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.isFormData) {
      body = options.body as FormData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 422) {
      throw new ApiError(data?.message ?? "Error de validación", 422, data?.errors);
    }
    throw new ApiError(data?.message ?? `Error ${response.status}`, response.status);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    apiFetch<T>(path, { method: "POST", body: formData, isFormData: true }),
};
