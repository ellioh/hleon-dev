import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function readPosts(): Post[] {
  const p = path.join(dataDir, "posts.json");
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writePosts(posts: Post[]) {
  fs.writeFileSync(path.join(dataDir, "posts.json"), JSON.stringify(posts, null, 2));
}

export interface Post {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  tags: string[];
  metaDescripcion: string;
  publicado: boolean;
  fechaPublicacion: string;
  fechaActualizacion: string;
}

export function getPosts(soloPublicados = true): Post[] {
  const all = readPosts();
  if (!soloPublicados) return all;
  return all.filter((p) => p.publicado).sort(
    (a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
  );
}

export function getPost(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug && p.publicado);
}

export function getPostById(id: string): Post | undefined {
  return readPosts().find((p) => p.id === id);
}

export function savePost(data: Partial<Post> & { titulo: string; contenido: string }): Post {
  const all = readPosts();
  const isNew = !data.id;
  const now = new Date().toISOString();

  const post: Post = {
    id: data.id || Date.now().toString(),
    slug: data.slug || slugify(data.titulo),
    titulo: data.titulo,
    resumen: data.resumen || "",
    contenido: data.contenido,
    categoria: data.categoria || "General",
    tags: data.tags || [],
    metaDescripcion: data.metaDescripcion || data.resumen || "",
    publicado: data.publicado ?? false,
    fechaPublicacion: data.fechaPublicacion || now,
    fechaActualizacion: now,
  };

  if (isNew) {
    all.unshift(post);
  } else {
    const idx = all.findIndex((p) => p.id === post.id);
    if (idx >= 0) all[idx] = post;
    else all.unshift(post);
  }

  writePosts(all);
  return post;
}

export function deletePost(id: string) {
  writePosts(readPosts().filter((p) => p.id !== id));
}

export function getCategorias(): string[] {
  const posts = readPosts().filter((p) => p.publicado);
  return [...new Set(posts.map((p) => p.categoria))].sort();
}

export function getPostsByCategoria(categoria: string): Post[] {
  return getPosts().filter((p) => p.categoria === categoria);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
