import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function readJson<T>(file: string): T {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJson(file: string, data: unknown) {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: string[];
  categoria: string;
  imagen: string | null;
  url: string | null;
  destacado: boolean;
  orden: number;
}

export interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  tipo: string;
  descripcion: string;
  presupuesto: string;
  fecha: string;
  leido: boolean;
}

export function getProyectos(): Proyecto[] {
  return readJson<Proyecto[]>("proyectos.json");
}

export function saveProyectos(proyectos: Proyecto[]) {
  writeJson("proyectos.json", proyectos);
}

export function getSolicitudes(): Solicitud[] {
  return readJson<Solicitud[]>("solicitudes.json");
}

export function saveSolicitud(s: Omit<Solicitud, "id" | "fecha" | "leido">): Solicitud {
  const all = getSolicitudes();
  const nueva: Solicitud = {
    ...s,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
    leido: false,
  };
  all.unshift(nueva);
  writeJson("solicitudes.json", all);
  return nueva;
}

export function marcarLeido(id: string) {
  const all = getSolicitudes();
  writeJson("solicitudes.json", all.map(s => s.id === id ? { ...s, leido: true } : s));
}
